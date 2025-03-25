// 处理游戏UI和用户交互
document.addEventListener('DOMContentLoaded', function() {
  // 游戏初始配置界面
  const configForm = document.getElementById('game-config');
  configForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const playerCount = parseInt(document.getElementById('player-count').value);
    startGame(playerCount);
  });
  
  // 操作按钮事件监听
  document.getElementById('next-phase-btn').addEventListener('click', function() {
    if (!game) return;
    game.nextPhase();
  });
  
  document.getElementById('draw-card-btn').addEventListener('click', function() {
    if (!game) return;
    
    const player = game.getCurrentPlayer();
    if ((game.currentPhase === 'trading' || game.currentPhase === 'movement') && player.actionPoints > 0) {
      player.actionPoints--;
      
      // 随机决定抽资源卡还是事件卡 (70%几率抽资源卡)
      const isResourceCard = Math.random() < 0.7;
      const card = isResourceCard ? game.resourceDeck.draw() : game.eventDeck.draw();
      
      if (card) {
        if (card.type === 'resource') {
          player.addCard(card);
          alert(`你抽取了一张资源卡: ${card.getDisplayName()}`);
        } else {
          // 处理事件卡效果
          game.eventSystem.handleEventCard(card, player);
          game.eventDeck.discard(card); // 用完丢弃
        }
      } else {
        alert('牌堆已空!');
      }
      
      game.updateUI();
    } else {
      if (game.currentPhase !== 'trading' && game.currentPhase !== 'movement') {
        alert('只能在移动或交易阶段抽卡');
      } else if (player.actionPoints <= 0) {
        alert('没有足够的行动点');
      }
    }
  });
  
  document.getElementById('build-route-btn').addEventListener('click', function() {
    if (!game) return;
    
    if (game.currentPhase === 'building') {
      game.routeBuilding = {};
      
      // 收集所有城市
      const cityOptions = Object.entries(game.gameBoard.cities)
        .map(([id, city]) => `<option value="${id}">${city.name}</option>`)
        .join('');
      
      // 显示路线建设对话框
      const dialog = document.getElementById('resource-selection-dialog');
      dialog.innerHTML = `
        <h3>建立贸易路线</h3>
        <div>
          <label for="from-city">起点城市:</label>
          <select id="from-city">${cityOptions}</select>
        </div>
        <div style="margin-top:10px;">
          <label for="to-city">终点城市:</label>
          <select id="to-city">${cityOptions}</select>
        </div>
        <p>选择资源卡用于铺设路线:</p>
        <div id="resource-selection-cards"></div>
        <div class="dialog-buttons">
          <button id="confirm-route">确认</button>
          <button id="cancel-route">取消</button>
        </div>
      `;
      
      dialog.style.display = 'block';
      
      // 显示玩家卡牌
      const cardsContainer = document.getElementById('resource-selection-cards');
      game.getCurrentPlayer().hand.forEach((card, index) => {
        if (card.type === 'resource') {
          const cardElement = card.createCardElement();
          cardElement.dataset.index = index;
          cardElement.addEventListener('click', () => selectCardForRoute(index));
          cardsContainer.appendChild(cardElement);
        }
      });
      
      // 设置确认按钮
      document.getElementById('confirm-route').addEventListener('click', function() {
        const fromCityId = document.getElementById('from-city').value;
        const toCityId = document.getElementById('to-city').value;
        
        // 验证选择
        if (fromCityId === toCityId) {
          alert('起点和终点不能相同');
          return;
        }
        
        if (game.selectedCardsForRoute.length !== 2) {
          alert('请选择两张资源卡用于铺设路线');
          return;
        }
        
        // 设置路线建设信息
        game.routeBuilding.from = fromCityId;
        game.routeBuilding.to = toCityId;
        
        // 获取选中的资源
        const player = game.getCurrentPlayer();
        const resources = game.selectedCardsForRoute.map(idx => player.hand[idx].subtype);
        
        // 建立路线
        const success = game.establishTradeRoute(player, fromCityId, toCityId, resources);
        
        if (success) {
          alert(`成功铺设从 ${game.gameBoard.cities[fromCityId].name} 到 ${game.gameBoard.cities[toCityId].name} 的路线!`);
          dialog.style.display = 'none';
        } else {
          alert('路线铺设失败');
        }
        
        // 重置状态
        game.routeBuilding = null;
        game.selectedCardsForRoute = [];
      });
      
      // 设置取消按钮
      document.getElementById('cancel-route').addEventListener('click', function() {
        dialog.style.display = 'none';
        game.routeBuilding = null;
        game.selectedCardsForRoute = [];
      });
      
      // 设置卡牌选择模式
      game.cardSelectionMode = 'route';
      game.selectedCardsForRoute = [];
    } else {
      alert('只能在建设阶段建立路线');
    }
  });
  
  document.getElementById('trade-btn').addEventListener('click', function() {
    if (!game) return;
    
    if (game.currentPhase === 'trading') {
      if (game.players.length < 2) {
        alert('需要至少两名玩家才能交易');
        return;
      }
      
      // 显示交易对话框
      const tradeDialog = document.getElementById('trade-dialog');
      
      // 创建玩家选择列表 (排除当前玩家)
      const otherPlayers = game.players.filter(p => p.id !== game.getCurrentPlayer().id);
      const playerOptions = otherPlayers
        .map(p => `<option value="${p.id}">${p.name}</option>`)
        .join('');
      
      tradeDialog.innerHTML = `
        <h3>发起交易</h3>
        <div>
          <label for="trade-partner">选择交易对象:</label>
          <select id="trade-partner">${playerOptions}</select>
        </div>
        <h4>选择要提供的卡牌:</h4>
        <div id="trade-my-cards" class="trade-cards"></div>
        <div class="dialog-buttons">
          <button id="confirm-trade">确认交易</button>
          <button id="cancel-trade">取消</button>
        </div>
      `;
      
      tradeDialog.style.display = 'block';
      
      // 显示当前玩家的卡牌
      const myCardsContainer = document.getElementById('trade-my-cards');
      game.getCurrentPlayer().hand.forEach((card, index) => {
        const cardElement = card.createCardElement();
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', () => selectCardForTrade(index));
        myCardsContainer.appendChild(cardElement);
      });
      
      // 设置交易模式
      game.cardSelectionMode = 'trade';
      game.selectedCardsForTrade = [];
      
      // 处理确认和取消按钮
      document.getElementById('confirm-trade').addEventListener('click', confirmTrade);
      document.getElementById('cancel-trade').addEventListener('click', () => {
        tradeDialog.style.display = 'none';
        game.cardSelectionMode = null;
        game.selectedCardsForTrade = [];
      });
    } else {
      alert('只能在交易阶段发起交易');
    }
  });
  
  // Canvas点击处理
  const canvas = document.getElementById('gameCanvas');
  canvas.addEventListener('click', function(e) {
    if (!game) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 处理游戏板上的点击
    handleBoardClick(x, y);
  });
});

// 游戏实例
let game;

// 启动游戏
function startGame(playerCount) {
  // 隐藏配置界面
  document.getElementById('game-config').style.display = 'none';
  
  // 显示游戏界面
  document.getElementById('game-ui').style.display = 'block';
  
  // 初始化游戏
  game = new AncientTradeGame(playerCount);
}

// 处理游戏板点击
function handleBoardClick(x, y) {
  if (!game) return;
  
  // 获取点击位置信息
  const clickResult = game.gameBoard.checkClick(x, y);
  
  // 不同阶段处理点击的方式不同
  switch (game.currentPhase) {
    case 'movement':
      // 如果点击了城市，移动到该位置
      if (clickResult.type === 'city') {
        game.movePlayer(clickResult.data);
      }
      break;
      
    case 'trading':
      // 如果点击了资源点或市场，可以获取资源
      if (clickResult.type === 'resource' && 
          (clickResult.data.type === 'market' || clickResult.data.type === 'port')) {
        const player = game.getCurrentPlayer();
        if (player.actionPoints > 0) {
          player.actionPoints--;
          const card = game.resourceDeck.draw();
          if (card) {
            player.addCard(card);
            alert(`在${game.gameBoard.getResourcePointName(clickResult.data.type)}获得了一张 ${card.getDisplayName()} 卡`);
            game.updateUI();
          } else {
            alert('资源牌已用尽');
          }
        } else {
          alert('没有足够的行动点');
        }
      }
      break;
      
    case 'building':
      // 如果在建立贸易路线模式
      if (game.routeBuilding) {
        if (clickResult.type === 'city') {
          if (!game.routeBuilding.from) {
            game.routeBuilding.from = clickResult.id;
            alert(`选择了起点: ${clickResult.data.name}`);
          } else {
            game.routeBuilding.to = clickResult.id;
            alert(`选择了终点: ${clickResult.data.name}，现在选择要使用的资源卡`);
            showResourceSelectionForRoute();
          }
        }
      }
      // 如果点击了文化中心
      else if (clickResult.type === 'city' && 
               (clickResult.id === 'samarkand' || clickResult.id === 'timbuktu')) {
        showCultureInvestmentDialog(clickResult.id);
      }
      break;
  }
}

// 显示文化工程投资对话框
function showCultureInvestmentDialog(cityId) {
  const player = game.getCurrentPlayer();
  
  // 过滤出可用于文化工程的卡牌
  const culturalCards = player.hand.filter(card => 
    card.type === 'resource' && 
    (card.subtype === 'academic' || card.subtype === 'textile')
  );
  
  if (culturalCards.length === 0) {
    alert('你没有可用于文化工程的卡牌（学术资源或纺织品）');
    return;
  }
  
  // 创建对话框
  const dialog = document.createElement('div');
  dialog.className = 'dialog';
  dialog.innerHTML = `
    <h3>在${game.gameBoard.cities[cityId].name}投资文化工程</h3>
    <p>选择用于投资的卡牌:</p>
    <div id="cultural-cards"></div>
    <div class="dialog-buttons">
      <button id="confirm-culture">确认投资</button>
      <button id="cancel-culture">取消</button>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // 显示可用卡牌
  const cardsContainer = document.getElementById('cultural-cards');
  culturalCards.forEach((card, index) => {
    const originalIndex = player.hand.indexOf(card);
    const cardElement = card.createCardElement();
    cardElement.dataset.index = originalIndex;
    cardElement.addEventListener('click', function() {
      // 投资文化工程
      const result = player.investInCulture(originalIndex);
      if (result > 0) {
        alert(`在${game.gameBoard.cities[cityId].name}成功投资文化工程，获得${result}文化点`);
        
        // 特别标记在廷巴克图投资的任务
        if (cityId === 'timbuktu') {
          player.specialAbilities.investedInTimbuktu = true;
          player.checkSecretTasks(game);
        }
        
        // 更新游戏状态
        game.updateUI();
        
        // 关闭对话框
        document.body.removeChild(dialog);
      }
    });
    cardsContainer.appendChild(cardElement);
  });
  
  // 设置按钮事件
  document.getElementById('cancel-culture').addEventListener('click', function() {
    document.body.removeChild(dialog);
  });
  
  document.getElementById('confirm-culture').addEventListener('click', function() {
    alert('请直接点击想要投入的卡牌');
  });
}

// 为路线选择资源卡牌
function showResourceSelectionForRoute() {
  if (!game || !game.routeBuilding || !game.routeBuilding.from || !game.routeBuilding.to) return;
  
  const dialog = document.getElementById('resource-selection-dialog');
  dialog.innerHTML = `
    <h3>选择用于铺设路线的资源</h3>
    <p>从 ${game.gameBoard.cities[game.routeBuilding.from].name} 到 ${game.gameBoard.cities[game.routeBuilding.to].name}</p>
    <p>请选择要使用的资源卡(需要2张):</p>
    <div id="resource-selection-cards"></div>
    <div class="dialog-buttons">
      <button id="confirm-resources">确认</button>
      <button id="cancel-resources">取消</button>
    </div>
  `;
  
  dialog.style.display = 'block';
  
  // 显示玩家的资源卡
  const resourceCards = game.getCurrentPlayer().hand.filter(card => card.type === 'resource');
  const cardsContainer = document.getElementById('resource-selection-cards');
  
  resourceCards.forEach((card, index) => {
    const originalIndex = game.getCurrentPlayer().hand.indexOf(card);
    const cardElement = card.createCardElement();
    cardElement.dataset.index = originalIndex;
    cardElement.addEventListener('click', () => selectCardForRoute(originalIndex));
    cardsContainer.appendChild(cardElement);
  });
  
  // 设置按钮事件
  document.getElementById('confirm-resources').addEventListener('click', function() {
    const player = game.getCurrentPlayer();
    
    if (game.selectedCardsForRoute.length !== 2) {
      alert('请选择2张资源卡');
      return;
    }
    
    // 获取资源类型
    const resources = game.selectedCardsForRoute.map(idx => player.hand[idx].subtype);
    
    // 建立路线
    const success = game.establishTradeRoute(
      player, 
      game.routeBuilding.from,
      game.routeBuilding.to,
      resources
    );
    
    if (success) {
      alert(`成功铺设从 ${game.gameBoard.cities[game.routeBuilding.from].name} 到 ${game.gameBoard.cities[game.routeBuilding.to].name} 的路线!`);
      dialog.style.display = 'none';
      
      // 重置状态
      game.cardSelectionMode = null;
      game.selectedCardsForRoute = [];
      game.routeBuilding = null;
    } else {
      alert('路线铺设失败');
    }
  });
  
  document.getElementById('cancel-resources').addEventListener('click', function() {
    dialog.style.display = 'none';
    game.cardSelectionMode = null;
    game.selectedCardsForRoute = [];
  });
  
  // 设置卡牌选择模式
  game.cardSelectionMode = 'route';
  game.selectedCardsForRoute = [];
}

// 选择用于路线的卡牌
function selectCardForRoute(index) {
  const cardIndex = game.selectedCardsForRoute.indexOf(index);
  const cardElement = document.querySelectorAll('#resource-selection-cards .card')[
    [...document.querySelectorAll('#resource-selection-cards .card')].findIndex(el => parseInt(el.dataset.index) === index)
  ];
  
  if (cardIndex >= 0) {
    // 取消选择
    game.selectedCardsForRoute.splice(cardIndex, 1);
    cardElement.classList.remove('selected');
  } else if (game.selectedCardsForRoute.length < 2) {
    // 新选择
    game.selectedCardsForRoute.push(index);
    cardElement.classList.add('selected');
  } else {
    alert('最多只能选择2张卡牌');
  }
}

// 选择用于交易的卡牌
function selectCardForTrade(index) {
  const cardIndex = game.selectedCardsForTrade.indexOf(index);
  const cardElement = document.querySelectorAll('#trade-my-cards .card')[
    [...document.querySelectorAll('#trade-my-cards .card')].findIndex(el => parseInt(el.dataset.index) === index)
  ];
  
  if (cardIndex >= 0) {
    // 取消选择
    game.selectedCardsForTrade.splice(cardIndex, 1);
    cardElement.classList.remove('selected');
  } else {
    // 新选择
    game.selectedCardsForTrade.push(index);
    cardElement.classList.add('selected');
  }
}

// 确认交易
function confirmTrade() {
  if (!game.selectedCardsForTrade.length) {
    alert('请至少选择一张卡牌用于交易');
    return;
  }
  
  const currentPlayer = game.getCurrentPlayer();
  const partnerId = document.getElementById('trade-partner').value;
  const partnerPlayer = game.players.find(p => p.id == partnerId);
  
  if (!partnerPlayer) {
    alert('交易对象无效');
    return;
  }
  
  // 简化版交易实现 - 实际应该让对方也选择卡牌
  // 这里模拟对方提供一张随机卡牌
  if (partnerPlayer.hand.length === 0) {
    alert(`${partnerPlayer.name} 没有卡牌可用于交易`);
    return;
  }
  
  // 模拟对方选择一张随机卡牌
  const partnerCardIndex = Math.floor(Math.random() * partnerPlayer.hand.length);
  const partnerCard = partnerPlayer.hand[partnerCardIndex];
  
  // 显示确认对话框
  if (confirm(`${partnerPlayer.name} 愿意用 ${partnerCard.getDisplayName()} 交换你选择的卡牌，是否确认交易？`)) {
    // 执行交易
    const success = game.tradeBetweenPlayers(
      currentPlayer, 
      partnerPlayer, 
      game.selectedCardsForTrade, 
      [partnerCardIndex]
    );
    
    if (success) {
      alert('交易成功!');
      
      // 隐藏对话框并更新游戏状态
      document.getElementById('trade-dialog').style.display = 'none';
      game.cardSelectionMode = null;
      game.selectedCardsForTrade = [];
      game.updateUI();
    } else {
      alert('交易失败');
    }
  }
}