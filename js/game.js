class AncientTradeGame {
  constructor(playerCount) {
    this.players = [];
    this.currentPlayerIndex = 0;
    this.round = 1;
    this.maxRounds = 20;
    this.gameBoard = new GameBoard('gameCanvas');
    this.resourceDeck = new Deck();
    this.eventDeck = new Deck();
    this.currentPhase = 'planning'; // planning, movement, trading, building, ending
    
    // 初始化交互状态变量
    this.routeBuilding = null;
    this.cardSelectionMode = null;
    this.selectedCardsForRoute = [];
    this.selectedCardsForTrade = [];
    
    // 初始化事件系统
    this.eventSystem = new EventSystem(this);
    
    // 游戏初始化
    this.initialize(playerCount);
    
    // 设置游戏板的引用
    this.gameBoard.setGame(this);
  }
  
  // 修改initialize方法
  initialize(playerCount) {
    // 创建玩家
    const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
    for (let i = 0; i < playerCount; i++) {
      const player = new Player(i, `玩家${i+1}`, colors[i]);
    
      // 设置起始位置
      if (i % 3 === 0) {
        player.position = this.gameBoard.cities.changan;
      } else if (i % 3 === 1) {
        player.position = this.gameBoard.cities.guangzhou;
      } else {
        player.position = this.gameBoard.cities.timbuktu;
      }
    
      this.players.push(player);
    }
  
    // 初始化卡牌
    this.resourceDeck.initialize();
    this.eventDeck.initialize(); // 确保也初始化事件卡组
  
    // 分发初始卡牌和秘密任务
    this.dealInitialCards();
  
    // 绘制游戏板
    this.gameBoard.drawBoard();
    this.updateUI();
  }
  
  dealInitialCards() {
    // 每个玩家初始获得5张资源卡
    this.players.forEach(player => {
      for (let i = 0; i < 5; i++) {
        player.addCard(this.resourceDeck.draw());
      }
      
      // 分配1-2张秘密任务
      const taskCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < taskCount; i++) {
        player.secretTasks.push(this.generateSecretTask());
      }
    });
  }
  
  // 修改generateSecretTask方法支持多语言
  generateSecretTask() {
    // 生成随机秘密任务
    const tasks = [
      { 
        description: "3回合内铺设长安—撒马尔罕路线", 
        description_en: "Establish Chang'an-Samarkand route within 3 rounds",
        reward: 10, 
        penalty: 5,
        checkCompletion: (player, game) => {
          // 检查是否在前3回合完成了该路线
          if (game.round <= 3) {
            return game.isRouteConnected('changan', 'samarkand', player.routes);
          }
          return false;
        }
      },
      { 
        description: "完成广州—威尼斯的海上路线并交易黄金", 
        description_en: "Complete Guangzhou-Venice sea route and trade gold",
        reward: 12, 
        penalty: 6,
        checkCompletion: (player, game) => {
          // 检查是否完成了该路线并曾经交易过黄金
          return game.isRouteConnected('guangzhou', 'venice', player.routes) && 
                player.specialAbilities.tradedGold === true;
        }
      },
      { 
        description: "积累10点文化影响力", 
        description_en: "Accumulate 10 cultural influence points",
        reward: 8, 
        penalty: 4,
        checkCompletion: (player, game) => {
          return player.culturalPoints >= 10;
        }
      },
      { 
        description: "在廷巴克图投资文化工程", 
        description_en: "Invest in cultural projects in Timbuktu",
        reward: 8, 
        penalty: 3,
        checkCompletion: (player, game) => {
          return player.specialAbilities.investedInTimbuktu === true;
        }
      },
      { 
        description: "收集至少3种不同的资源类型", 
        description_en: "Collect at least 3 different resource types",
        reward: 6, 
        penalty: 2,
        checkCompletion: (player, game) => {
          const resourceTypes = new Set();
          player.hand.forEach(card => {
            if (card.type === 'resource') {
              resourceTypes.add(card.subtype);
            }
          });
          return resourceTypes.size >= 3;
        }
      }
    ];
    
    return tasks[Math.floor(Math.random() * tasks.length)];
  }
  
  // 开始新回合
  startNewRound() {
    this.round++;
    this.currentPlayerIndex = 0;
    this.currentPhase = 'planning';
    
    // 处理过期事件
    this.eventSystem.processEvents();
    
    // 重置所有玩家的行动点
    this.players.forEach(player => player.resetActionPoints());
    
    this.updateUI();
    
    // 检查游戏结束条件
    if (this.round > this.maxRounds || this.checkEndGameTrigger()) {
      this.endGame();
      return;
    }
  }
  
  // 玩家行动阶段控制
  nextPhase() {
    const phases = ['planning', 'movement', 'trading', 'building', 'ending'];
    const currentIndex = phases.indexOf(this.currentPhase);
    
    if (currentIndex < phases.length - 1) {
      this.currentPhase = phases[currentIndex + 1];
    } else {
      // 移至下一个玩家
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
      
      // 如果回到第一个玩家，则新的回合开始
      if (this.currentPlayerIndex === 0) {
        this.startNewRound();
      } else {
        this.currentPhase = 'planning';
      }
    }
    
    this.updateUI();
  }
  
  // 获取当前玩家
  getCurrentPlayer() {
    return this.players[this.currentPlayerIndex];
  }
  
  // 移动玩家
  movePlayer(targetPosition) {
    const player = this.getCurrentPlayer();
    if (player.actionPoints > 0) {
      // TODO: 验证移动是否合法
      
      const moved = player.moveTo(targetPosition);
      if (moved) {
        // 检查是否触发事件
        this.checkLocationEvents(player, targetPosition);
        this.updateUI();
        return true;
      }
    }
    return false;
  }
  
  // 检查是否触发位置事件
  checkLocationEvents(player, position) {
    // 检查是否为危险区域
    const dangerZone = this.gameBoard.dangerZones.find(
      zone => Math.abs(zone.x - position.x) < 15 && Math.abs(zone.y - position.y) < 15
    );
    
    if (dangerZone) {
      if (dangerZone.type === 'sandstorm') {
        this.eventSystem.triggerSandstorm(player);
      } else if (dangerZone.type === 'bandits') {
        this.eventSystem.triggerBandits(player);
      } else if (dangerZone.type === 'pirates') {
        this.eventSystem.triggerBandits(player); // 使用相同逻辑
      } else if (dangerZone.type === 'slaveRevolt') {
        this.eventSystem.triggerSlaveRevolt(player);
      }
    }
    
    // 检查是否为资源点
    const resourcePoint = this.gameBoard.resourcePoints.find(
      point => Math.abs(point.x - position.x) < 15 && Math.abs(point.y - position.y) < 15
    );
    
    if (resourcePoint && player.actionPoints > 0) {
      // 提示玩家是否要使用行动点获取资源
      const useActionPoint = confirm(`你在${this.gameBoard.getResourcePointName(resourcePoint.type)}，是否使用1行动点获取资源？`);
      
      if (useActionPoint) {
        player.actionPoints--;
        
        // 抽取资源卡
        const card = this.resourceDeck.draw();
        if (card) {
          player.addCard(card);
          alert(`你获得了一张 ${card.getDisplayName()} 卡`);
          
          // 如果是盐矿，可以额外获得一张盐卡
          if (resourcePoint.type === 'salt') {
            const saltCard = new Card('resource', 'salt', 1, '可作为低成本补给');
            player.addCard(saltCard);
            alert('在盐矿区域，你额外获得了一张盐卡');
          }
          
          // 如果玩家有郑和航海加成，且在港口
          if (player.specialAbilities.indianOceanBonus && resourcePoint.type === 'port') {
            const bonusCard = this.resourceDeck.draw();
            if (bonusCard) {
              player.addCard(bonusCard);
              alert(`郑和航海的加成使你额外获得一张 ${bonusCard.getDisplayName()} 卡`);
            }
          }
        } else {
          alert('资源牌已用尽');
        }
      }
    }
    
    // 如果在城市，检查特定效果
    for (const [cityId, city] of Object.entries(this.gameBoard.cities)) {
      if (Math.abs(city.x - position.x) < 15 && Math.abs(city.y - position.y) < 15) {
        // 如果是廷巴克图且在文化阶段，标记秘密任务
        if (cityId === 'timbuktu' && this.currentPhase === 'building') {
          player.specialAbilities.investedInTimbuktu = true;
        }
        break;
      }
    }
  }
  
  // 玩家之间的交易
  tradeBetweenPlayers(player1, player2, cardsFromP1, cardsFromP2) {
    // 验证所有卡牌索引是否合法
    const validP1Cards = cardsFromP1.every(idx => idx >= 0 && idx < player1.hand.length);
    const validP2Cards = cardsFromP2.every(idx => idx >= 0 && idx < player2.hand.length);
    
    if (!validP1Cards || !validP2Cards) {
      console.error('交易卡牌索引无效');
      return false;
    }
    
    // 提取交易卡牌
    const p1Cards = cardsFromP1.map(idx => player1.hand[idx]);
    const p2Cards = cardsFromP2.map(idx => player2.hand[idx]);
    
    // 计算交易价值以确保交易公平(可选)
    const p1Value = p1Cards.reduce((sum, card) => sum + card.value, 0);
    const p2Value = p2Cards.reduce((sum, card) => sum + card.value, 0);
    
    // 如果需要执行交易价值验证，取消下面注释
    /*
    const maxDifference = 2; // 允许的最大价值差异
    if (Math.abs(p1Value - p2Value) > maxDifference) {
      console.log('交易不公平，价值相差过大');
      return false;
    }
    */
    
    // 执行交易 - 从双方手牌中移除并添加到对方手中
    // 注意：需要按索引从大到小排序以避免移除时索引混乱
    const sortedP1Indices = [...cardsFromP1].sort((a, b) => b - a);
    const sortedP2Indices = [...cardsFromP2].sort((a, b) => b - a);
    
    // 从双方手牌中移除
    for (const idx of sortedP1Indices) {
      player1.hand.splice(idx, 1);
    }
    
    for (const idx of sortedP2Indices) {
      player2.hand.splice(idx, 1);
    }
    
    // 将卡牌加入对方手中
    p1Cards.forEach(card => player2.addCard(card));
    p2Cards.forEach(card => player1.addCard(card));
    
    // 如果交易包含黄金，标记秘密任务可能需要
    if (p1Cards.some(card => card.subtype === 'gold') || p2Cards.some(card => card.subtype === 'gold')) {
      player1.specialAbilities.tradedGold = true;
      player2.specialAbilities.tradedGold = true;
    }
    
    // 交易成功信息
    console.log(`${player1.name} 和 ${player2.name} 交易成功`);
    console.log(`${player1.name} 送出价值${p1Value}点的资源，收到价值${p2Value}点的资源`);
    
    // 如果交易包含贵重物品(黄金、香料)，可能有额外效果
    const p1HasValuableGoods = p1Cards.some(card => 
      card.subtype === 'gold' || card.subtype === 'spice'
    );
    
    const p2HasValuableGoods = p2Cards.some(card => 
      card.subtype === 'gold' || card.subtype === 'spice'
    );
    
    if (p1HasValuableGoods || p2HasValuableGoods) {
      // 增加文化点数
      const culturalBonus = 1;
      player1.culturalPoints += culturalBonus;
      player2.culturalPoints += culturalBonus;
      alert(`贵重物品交易使双方各获得${culturalBonus}文化点`);
      console.log(`贵重物品交易使双方各获得${culturalBonus}文化点`);
    }
    
    return true;
  }
  
  // 建立贸易路线
  establishTradeRoute(player, from, to, resources) {
    const success = player.establishRoute(from, to, resources);
    if (success) {
      // 检查是否完成完整路线
      this.checkForCompletedRoutes(player);
      
      // 检查秘密任务是否完成
      player.checkSecretTasks(this);
      
      this.updateUI();
      return true;
    }
    return false;
  }
  
  // 检查完整路线
  checkForCompletedRoutes(player) {
    // 定义主要完整路线(起点到终点)
    const completeRoutes = [
      { from: 'changan', to: 'constantinople', region: 'silkRoad', name: '丝绸之路', points: 15 },
      { from: 'guangzhou', to: 'venice', region: 'indianOcean', name: '海上丝绸之路', points: 12 },
      { from: 'timbuktu', to: 'tangier', region: 'sahara', name: '撒哈拉贸易路线', points: 10 }
    ];
    
    // 检查玩家是否完成了任何完整路线
    for (const route of completeRoutes) {
      // 检查玩家是否铺设了这条路线所需的所有路段
      const routeSegments = this.getRouteSegments(route.from, route.to);
      
      // 检查玩家的路线是否包含所有必要路段
      let completed = true;
      for (let i = 0; i < routeSegments.length; i++) {
        const segment = routeSegments[i];
        const hasSegment = player.routes.some(r => 
          (r.from === segment.from && r.to === segment.to) || 
          (r.from === segment.to && r.to === segment.from)
        );
        
        if (!hasSegment) {
          completed = false;
          break;
        }
      }
      
      if (completed) {
        // 计算连通性 - 确保路线真正连接
        if (this.isRouteConnected(route.from, route.to, player.routes)) {
          console.log(`玩家 ${player.name} 完成了 ${route.name}!`);
          
          // 奖励胜利点
          const basePoints = route.points;
          let bonusPoints = 0;
          
          // 检查是否经过资源点和交易点 (加分)
          const resourcePointsCount = this.countResourcePointsOnRoute(player.routes, route.region);
          if (resourcePointsCount >= 1) {
            bonusPoints += 3;
          }
          
          const totalPoints = basePoints + bonusPoints;
          player.victoryPoints += totalPoints;
          
          // 显示完成路线的通知
          alert(`恭喜! 您完成了 ${route.name} 并获得 ${totalPoints} 胜利点!`);
          
          // 奖励额外资源卡
          const bonusCard = this.resourceDeck.draw();
          if (bonusCard) {
            player.addCard(bonusCard);
            alert(`作为奖励，您获得了一张 ${bonusCard.getDisplayName()} 卡`);
          }
          
          return true;
        }
      }
    }
    
    return false;
  }

  // 获取两点之间的路线段
  getRouteSegments(startCity, endCity) {
    // 实际地图中的路线段
    const mapSegments = {
      'silkRoad': [
        { from: 'changan', to: 'kashgar' },
        { from: 'kashgar', to: 'samarkand' },
        { from: 'samarkand', to: 'constantinople' }
      ],
      'indianOcean': [
        { from: 'guangzhou', to: 'calcutta' },
        { from: 'calcutta', to: 'aden' },
        { from: 'aden', to: 'venice' }
      ],
      'sahara': [
        { from: 'timbuktu', to: 'gao' },
        { from: 'gao', to: 'tangier' }
      ]
    };
    
    // 尝试在所有区域中找到路径
    for (const region in mapSegments) {
      const segments = mapSegments[region];
      
      // 构建城市索引映射
      const cityToSegments = {};
      segments.forEach(seg => {
        if (!cityToSegments[seg.from]) cityToSegments[seg.from] = [];
        if (!cityToSegments[seg.to]) cityToSegments[seg.to] = [];
        
        cityToSegments[seg.from].push(seg.to);
        cityToSegments[seg.to].push(seg.from); // 双向
      });
      
      // 使用BFS查找路径
      const queue = [[startCity, []]];
      const visited = new Set([startCity]);
      
      while (queue.length > 0) {
        const [current, path] = queue.shift();
        
        if (current === endCity) {
          // 找到路径，转换为路段
          const result = [];
          for (let i = 0; i < path.length; i++) {
            // 找到对应的路段
            const segmentFrom = path[i];
            const segmentTo = path[i + 1] || endCity;
            
            // 查找匹配的预定义路段
            const matchedSegment = segments.find(seg => 
              (seg.from === segmentFrom && seg.to === segmentTo) ||
              (seg.from === segmentTo && seg.to === segmentFrom)
            );
            
            if (matchedSegment) {
              result.push(matchedSegment);
            } else {
              // 创建一个新路段
              result.push({ from: segmentFrom, to: segmentTo });
            }
          }
          
          return result;
        }
        
        // 遍历相邻城市
        const neighbors = cityToSegments[current] || [];
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push([neighbor, [...path, current]]);
          }
        }
      }
    }
    
    // 没找到路径
    return [];
  }
  
  // 检查路线连通性
  isRouteConnected(start, end, playerRoutes) {
    // 使用BFS检查从start到end是否连通
    const visited = new Set();
    const queue = [start];
    visited.add(start);
    
    // 构建邻接图
    const adjacencyMap = {};
    playerRoutes.forEach(route => {
      if (!adjacencyMap[route.from]) adjacencyMap[route.from] = [];
      if (!adjacencyMap[route.to]) adjacencyMap[route.to] = [];
      
      adjacencyMap[route.from].push(route.to);
      adjacencyMap[route.to].push(route.from); // 路线是双向的
    });
    
    // BFS
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current === end) return true; // 找到终点
      
      // 遍历相邻节点
      const neighbors = adjacencyMap[current] || [];
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return false; // 未找到连通路径
  }
  
  // 计算路线上的资源点和交易点数量
  countResourcePointsOnRoute(playerRoutes, region) {
    let count = 0;
    
    // 遍历玩家的路线
    for (const route of playerRoutes) {
      // 获取该路段所经过的资源点
      const resourcePointsOnSegment = this.gameBoard.resourcePoints.filter(point => {
        // 检查资源点是否在该路段附近且属于同一区域
        return point.region === region && this.isPointNearSegment(
          point,
          this.gameBoard.cities[route.from],
          this.gameBoard.cities[route.to]
        );
      });
      
      count += resourcePointsOnSegment.length;
    }
    
    return count;
  }
  
  // 检查点是否靠近线段
  isPointNearSegment(point, start, end) {
    // 计算点到线段的距离
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    // 标准化方向向量
    const dirX = dx / length;
    const dirY = dy / length;
    
    // 计算点到起点的向量
    const vecX = point.x - start.x;
    const vecY = point.y - start.y;
    
    // 点在线段上的投影长度
    const projLength = vecX * dirX + vecY * dirY;
    
    // 如果投影在线段外，返回false
    if (projLength < 0 || projLength > length) {
      return false;
    }
    
    // 计算点到线段的垂直距离
    const projX = start.x + dirX * projLength;
    const projY = start.y + dirY * projLength;
    const distance = Math.sqrt(
      Math.pow(point.x - projX, 2) + Math.pow(point.y - projY, 2)
    );
    
    // 如果距离小于阈值，认为点在线段附近
    return distance < 20; // 20像素的阈值
  }
  
  // 增强updateUI方法
  updateUI() {
    // 重绘游戏板
    this.gameBoard.drawBoard();
    
    // 绘制玩家位置
    this.players.forEach(player => {
      const pos = player.position;
      if (pos) {
        this.gameBoard.ctx.fillStyle = player.color;
        this.gameBoard.ctx.beginPath();
        this.gameBoard.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
        this.gameBoard.ctx.fill();
        
        // 添加玩家名称
        this.gameBoard.ctx.fillStyle = '#000';
        this.gameBoard.ctx.font = '10px Arial';
        this.gameBoard.ctx.textAlign = 'center';
        this.gameBoard.ctx.fillText(player.name, pos.x, pos.y - 15);
      }
    });
    
    // 更新玩家信息面板
    this.updatePlayerInfoPanel();
    
    // 更新当前阶段信息，添加行动点显示
    const phaseInfo = document.getElementById('phase-info');
    if (phaseInfo) {
      phaseInfo.innerHTML = `
        <div>${window.translate('round')}: ${this.round}, ${window.translate('phase')}: <span class="highlight-phase">${this.getPhaseDisplayName()}</span></div>
        <div>${window.translate('current_action')}: ${this.getCurrentPlayer().name}</div>
        <div>${window.translate('action_points')}: <span class="highlight-ap">${this.getCurrentPlayer().actionPoints}</span></div>
      `;
    }
    
    // 确保每次都更新按钮状态
    this.updateActionButtons();
  }
  
  // 确保这两个方法完整实现在game.js中

  // 更新按钮状态
  updateActionButtons() {
    const drawCardBtn = document.getElementById('draw-card-btn');
    const buildRouteBtn = document.getElementById('build-route-btn');
    const tradeBtn = document.getElementById('trade-btn');
    
    // 如果找不到按钮，退出函数
    if (!drawCardBtn || !buildRouteBtn || !tradeBtn) return;
    
    const player = this.getCurrentPlayer();
    const noActionPoints = player.actionPoints <= 0;
    
    // 清除所有之前的提示类
    drawCardBtn.classList.remove('disabled-no-ap', 'disabled-wrong-phase');
    buildRouteBtn.classList.remove('disabled-no-ap', 'disabled-wrong-phase');
    tradeBtn.classList.remove('disabled-no-ap', 'disabled-wrong-phase');
    
    // 根据当前阶段启用/禁用按钮
    switch(this.currentPhase) {
      case 'planning':
        this.disableButton(drawCardBtn, 'disabled-wrong-phase', window.translate('tooltip_draw_wrong_phase'));
        this.disableButton(buildRouteBtn, 'disabled-wrong-phase', window.translate('tooltip_route_wrong_phase'));
        this.disableButton(tradeBtn, 'disabled-wrong-phase', window.translate('tooltip_trade_wrong_phase'));
        break;
      case 'movement':
        if (noActionPoints) {
          this.disableButton(drawCardBtn, 'disabled-no-ap', window.translate('tooltip_draw_no_ap'));
        } else {
          drawCardBtn.disabled = false;
          drawCardBtn.title = window.translate('tooltip_draw_ok');
        }
        this.disableButton(buildRouteBtn, 'disabled-wrong-phase', window.translate('tooltip_route_wrong_phase'));
        this.disableButton(tradeBtn, 'disabled-wrong-phase', window.translate('tooltip_trade_wrong_phase'));
        break;
      case 'trading':
        if (noActionPoints) {
          this.disableButton(drawCardBtn, 'disabled-no-ap', window.translate('tooltip_draw_no_ap'));
        } else {
          drawCardBtn.disabled = false;
          drawCardBtn.title = window.translate('tooltip_draw_ok');
        }
        this.disableButton(buildRouteBtn, 'disabled-wrong-phase', window.translate('tooltip_route_wrong_phase'));
        tradeBtn.disabled = false;
        tradeBtn.title = window.translate('tooltip_trade_ok');
        break;
      case 'building':
        this.disableButton(drawCardBtn, 'disabled-wrong-phase', window.translate('tooltip_draw_wrong_phase'));
        buildRouteBtn.disabled = false;
        buildRouteBtn.title = window.translate('tooltip_route_ok');
        this.disableButton(tradeBtn, 'disabled-wrong-phase', window.translate('tooltip_trade_wrong_phase'));
        break;
      case 'ending':
        this.disableButton(drawCardBtn, 'disabled-wrong-phase', window.translate('tooltip_draw_wrong_phase'));
        this.disableButton(buildRouteBtn, 'disabled-wrong-phase', window.translate('tooltip_route_wrong_phase'));
        this.disableButton(tradeBtn, 'disabled-wrong-phase', window.translate('tooltip_trade_wrong_phase'));
        break;
    }
  }

  // 禁用按钮并添加提示
  disableButton(button, className, tooltip) {
    button.disabled = true;
    button.title = tooltip;
    button.classList.add(className);
  }

  // 修改显示阶段名称函数以支持语言切换
  getPhaseDisplayName() {
    // 安全回退，如果translate未定义
    const safeTranslate = (key) => {
      if (typeof window.translate === 'function') {
        return window.translate(key);
      }
      
      // 默认翻译
      const defaultPhrases = {
        'planning_phase': '准备与规划阶段',
        'movement_phase': '移动阶段',
        'trading_phase': '交易与互动阶段',
        'building_phase': '建设与文化工程阶段',
        'ending_phase': '结束阶段'
      };
      
      return defaultPhrases[key] || key;
    };
    
    const phaseNames = {
      'planning': safeTranslate('planning_phase'),
      'movement': safeTranslate('movement_phase'), 
      'trading': safeTranslate('trading_phase'),
      'building': safeTranslate('building_phase'),
      'ending': safeTranslate('ending_phase')
    };
    
    return phaseNames[this.currentPhase] || this.currentPhase;
  }
  
  // 更新玩家信息面板
  // 修改游戏类中的updatePlayerInfoPanel方法
  updatePlayerInfoPanel() {
    const player = this.getCurrentPlayer();
    const panel = document.getElementById('player-info');
    const lang = window.currentLanguage || 'zh';
    
    // 使用翻译函数
    panel.innerHTML = `
      <h3>${window.translate('player')}: ${lang === 'en' ? `Player ${player.id + 1}` : player.name}</h3>
      <p>${window.translate('color')}: <span style="color:${player.color}">${window.translate(player.color)}</span></p>
      <p>${window.translate('action_points')}: ${player.actionPoints}</p>
      <p>${window.translate('victory_points')}: ${player.victoryPoints}</p>
      <p>${window.translate('cultural_points')}: ${player.culturalPoints}</p>
      <h4>${window.translate('hand_cards')}:</h4>
      <div id="player-hand"></div>
      <h4>${window.translate('secret_tasks')}:</h4>
      <div id="secret-tasks"></div>
    `;
    
    // 显示手牌
    const handContainer = document.getElementById('player-hand');
    player.hand.forEach((card, index) => {
      const cardElement = card.createCardElement(lang); // 添加语言参数
      cardElement.dataset.index = index;
      cardElement.addEventListener('click', () => this.selectCard(index));
      handContainer.appendChild(cardElement);
    });
    
    // 显示秘密任务
    const tasksContainer = document.getElementById('secret-tasks');
    player.secretTasks.forEach(task => {
      const taskElement = document.createElement('div');
      taskElement.className = `secret-task ${task.completed ? 'completed' : ''}`;
      
      // 使用翻译的描述
      taskElement.textContent = task[`description_${lang}`] || task.description;
      
      if (task.completed) {
        // 添加翻译的完成信息
        const completedText = lang === 'en' ? 
          `(Completed: +${task.reward} points)` : 
          `(已完成: +${task.reward}分)`;
        taskElement.textContent += ` ${completedText}`;
      }
      
      tasksContainer.appendChild(taskElement);
    });
  }
  
  // 选择卡牌
  selectCard(index) {
    // 处理卡牌选择逻辑
    if (this.cardSelectionMode === 'route') {
      // 为建立路线选择卡牌
      this.handleRouteCardSelection(index);
    } else if (this.cardSelectionMode === 'trade') {
      // 为交易选择卡牌
      this.handleTradeCardSelection(index);
    } else if (this.currentPhase === 'building') {
      // 在建设阶段，可以投资文化工程
      const player = this.getCurrentPlayer();
      const result = player.investInCulture(index);
      if (result > 0) {
        // 投资成功
        this.updateUI();
        
        // 更新文化工程相关任务
        player.checkSecretTasks(this);
      }
    }
  }
  
  // 处理路线卡牌选择
  handleRouteCardSelection(index) {
    const player = this.getCurrentPlayer();
    
    // 切换卡牌选择状态
    const cardIdx = this.selectedCardsForRoute.indexOf(index);
    if (cardIdx >= 0) {
      this.selectedCardsForRoute.splice(cardIdx, 1);
      document.querySelectorAll('#resource-selection-cards .card')[cardIdx].classList.remove('selected');
    } else {
      if (this.selectedCardsForRoute.length < 2) { // 最多选择2张卡
        this.selectedCardsForRoute.push(index);
        if (document.querySelectorAll('#resource-selection-cards .card')[this.selectedCardsForRoute.length - 1]) {
          document.querySelectorAll('#resource-selection-cards .card')[this.selectedCardsForRoute.length - 1].classList.add('selected');
        }
      }
    }
    
    // 如果选择了2张卡，可以尝试建立路线
    if (this.selectedCardsForRoute.length === 2 && this.routeBuilding && this.routeBuilding.from && this.routeBuilding.to) {
      const resources = this.selectedCardsForRoute.map(idx => player.hand[idx].subtype);
      this.establishTradeRoute(
        player, 
        this.routeBuilding.from, 
        this.routeBuilding.to,
        resources
      );
      
      // 重置选择状态
      this.cardSelectionMode = null;
      this.selectedCardsForRoute = [];
      this.routeBuilding = null;
      document.getElementById('resource-selection-dialog').style.display = 'none';
    }
  }
  
  // 处理交易卡牌选择
  handleTradeCardSelection(index) {
    const cardIdx = this.selectedCardsForTrade.indexOf(index);
    if (cardIdx >= 0) {
      this.selectedCardsForTrade.splice(cardIdx, 1);
      document.querySelectorAll('#trade-my-cards .card')[index].classList.remove('selected');
    } else {
      this.selectedCardsForTrade.push(index);
      document.querySelectorAll('#trade-my-cards .card')[index].classList.add('selected');
    }
  }
  
  // 检查游戏结束触发条件
  checkEndGameTrigger() {
    // 检查任一玩家是否完成了所有区域的路线
    for (const player of this.players) {
      let completedRegions = 0;
      
      // 检查丝绸之路
      if (this.isRouteConnected('changan', 'constantinople', player.routes)) {
        completedRegions++;
      }
      
      // 检查海上路线
      if (this.isRouteConnected('guangzhou', 'venice', player.routes)) {
        completedRegions++;
      }
      
      // 检查撒哈拉路线
      if (this.isRouteConnected('timbuktu', 'tangier', player.routes)) {
        completedRegions++;
      }
      
      // 如果一个玩家完成了至少两个区域，触发游戏结束
      if (completedRegions >= 2) {
        console.log(`${player.name} 完成了 ${completedRegions} 个区域的路线，触发游戏结束`);
        return true;
      }
    }
    
    // 检查资源卡抽取情况 (如果80%以上的卡被抽完)
    const totalCards = 120 + 80; // 资源卡和事件卡总数
    const remainingCards = this.resourceDeck.getCount() + this.eventDeck.getCount();
    const usedPercentage = (totalCards - remainingCards) / totalCards;
    
    if (usedPercentage > 0.8) {
      console.log(`已使用 ${Math.round(usedPercentage * 100)}% 的卡牌，触发游戏结束`);
      return true;
    }
    
    return false;
  }
  
  // 游戏结束结算
  endGame() {
    // 计算最终得分
    const finalScores = this.players.map(player => {
      return {
        name: player.name,
        color: player.color,
        score: player.calculateScore()
      };
    });
    
    // 按得分排序
    finalScores.sort((a, b) => b.score - a.score);
    
    // 显示结果
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'game-results';
    resultsContainer.innerHTML = '<h2>游戏结束!</h2>';
    
    finalScores.forEach((result, index) => {
      resultsContainer.innerHTML += `
        <p>${index + 1}. <span style="color:${result.color}">${result.name}</span>: ${result.score}分</p>
      `;
    });
    
    // 添加新游戏按钮
    resultsContainer.innerHTML += '<button id="new-game-btn">开始新游戏</button>';
    
    document.body.appendChild(resultsContainer);
    
    // 绑定新游戏按钮事件
    document.getElementById('new-game-btn').addEventListener('click', () => {
      location.reload();
    });
  }
}