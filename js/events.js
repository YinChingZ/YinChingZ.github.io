class EventSystem {
  constructor(game) {
    this.game = game;
    this.activeEvents = [];  // 跟踪活跃事件及其持续时间
  }
  
  // 注册新事件
  registerEvent(eventType, player, duration) {
    this.activeEvents.push({
      type: eventType,
      player: player,
      duration: duration,
      startedAt: this.game.round
    });
  }
  
  // 触发沙漠风暴事件
  triggerSandstorm(player) {
    const diceResult = Math.floor(Math.random() * 6) + 1;
    let resultMessage = '';
    
    if (diceResult <= 2) {
      // 失去2资源并退回
      if (player.hand.length > 0) {
        const lostCards = [];
        for (let i = 0; i < 2 && player.hand.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * player.hand.length);
          const lostCard = player.hand.splice(randomIndex, 1)[0];
          lostCards.push(lostCard);
          this.game.resourceDeck.discard(lostCard);
        }
        resultMessage = `骰子结果: ${diceResult} - 失去资源: ${lostCards.map(c => c.getDisplayName()).join(', ')}`;
      }
      
      // 退回上一步
      if (player.previousPosition) {
        player.position = player.previousPosition;
        resultMessage += '，并退回上一位置';
      }
    } else if (diceResult <= 4) {
      // 保持原位，但下回合移动减半
      this.registerEvent('movementPenalty', player, 1);
      player.specialAbilities.movementPenalty = true;
      resultMessage = `骰子结果: ${diceResult} - 保持原位，下回合移动力减半`;
    } else {
      // 免除风险，并获得1额外AP
      player.actionPoints++;
      resultMessage = `骰子结果: ${diceResult} - 幸运! 获得1额外行动点`;
    }
    
    return resultMessage;
  }
  
  // 触发海盗/强盗事件
  triggerBandits(player) {
    const payGold = confirm('遭遇强盗! 是否支付1黄金规避效果?');
    
    if (payGold) {
      // 寻找玩家手中的黄金卡
      const goldCardIndex = player.hand.findIndex(card => card.subtype === 'gold');
      if (goldCardIndex >= 0) {
        // 支付黄金
        const goldCard = player.hand.splice(goldCardIndex, 1)[0];
        this.game.resourceDeck.discard(goldCard);
        return '支付黄金贿赂强盗，避免了损失';
      }
    }
    
    // 如果没有黄金或拒绝支付，失去随机资源
    if (player.hand.length > 0) {
      const randomIndex = Math.floor(Math.random() * player.hand.length);
      const lostCard = player.hand.splice(randomIndex, 1)[0];
      this.game.resourceDeck.discard(lostCard);
      return `被强盗抢走了: ${lostCard.getDisplayName()}`;
    }
    
    return '被强盗袭击，但没有资源可抢';
  }
  
  // 触发奴隶起义
  triggerSlaveRevolt(player) {
    const hasSlaveCard = player.hand.some(card => card.subtype === 'slave');
    const hasGoldCard = player.hand.some(card => card.subtype === 'gold');
    
    // 提供选择
    let choice = '';
    if (hasSlaveCard && hasGoldCard) {
      choice = prompt('奴隶起义！请选择: 1=支付1黄金, 2=弃掉1奴隶卡, 3=接受惩罚');
    } else if (hasSlaveCard) {
      choice = prompt('奴隶起义！请选择: 2=弃掉1奴隶卡, 3=接受惩罚');
    } else if (hasGoldCard) {
      choice = prompt('奴隶起义！请选择: 1=支付1黄金, 3=接受惩罚');
    } else {
      alert('奴隶起义！你没有黄金或奴隶卡可用，将失去1回合和1文化点');
      player.specialAbilities.skipNextTurn = true;
      player.culturalPoints = Math.max(0, player.culturalPoints - 1);
      return '没有资源可用，失去1回合行动和1文化点';
    }
    
    if (choice === '1' && hasGoldCard) {
      // 支付黄金
      const goldIndex = player.hand.findIndex(card => card.subtype === 'gold');
      player.hand.splice(goldIndex, 1);
      return '支付1黄金平息起义';
    } else if (choice === '2' && hasSlaveCard) {
      // 弃掉奴隶卡
      const slaveIndex = player.hand.findIndex(card => card.subtype === 'slave');
      player.hand.splice(slaveIndex, 1);
      return '释放1名奴隶平息起义';
    } else {
      // 接受惩罚
      player.specialAbilities.skipNextTurn = true;
      player.culturalPoints = Math.max(0, player.culturalPoints - 1);
      return '选择接受惩罚，失去1回合行动和1文化点';
    }
  }
  
  // 触发蒙古帝国崛起事件 (正面)
  triggerMongolEmpire(player) {
    this.registerEvent('mongolEmpire', player, 3);
    player.specialAbilities.reducedMovementCost = true;
    return '蒙古帝国的崛起使丝绸之路更安全，未来3回合内你在丝路区域每移动消耗减少1AP';
  }
  
  // 触发郑和航海事件 (正面)
  triggerZhengHe(player) {
    this.registerEvent('zhengHe', player, 2);
    player.specialAbilities.indianOceanBonus = true;
    
    // 立即获得一张资源卡
    const newCard = this.game.resourceDeck.draw();
    if (newCard) {
      player.addCard(newCard);
      return `郑和的航海为你带来了新的贸易机会，获得1张${newCard.getDisplayName()}，未来2回合内每到达港口额外获得1资源`;
    }
    
    return '郑和的航海为你带来了新的贸易机会，未来2回合内每到达港口额外获得1资源';
  }
  
  // 触发马可·波罗旅行事件 (正面)
  triggerMarcoPolo(player) {
    player.culturalPoints += 3;
    return '马可·波罗的旅行为你带来了3点文化影响力';
  }
  
  // 触发宗教传播事件 (正面)
  triggerReligion(player) {
    const academicCards = player.hand.filter(card => card.subtype === 'academic');
    if (academicCards.length > 0) {
      const convertCount = prompt(`你有${academicCards.length}张学术资源，想要将多少张转换为胜利点？(1张=2分)`);
      const count = parseInt(convertCount);
      
      if (isNaN(count) || count <= 0 || count > academicCards.length) {
        return '无效的选择，没有转换';
      }
      
      // 从手牌中移除学术卡
      let converted = 0;
      for (let i = player.hand.length - 1; i >= 0 && converted < count; i--) {
        if (player.hand[i].subtype === 'academic') {
          this.game.resourceDeck.discard(player.hand.splice(i, 1)[0]);
          converted++;
        }
      }
      
      // 增加胜利点
      const gainedPoints = converted * 2;
      player.victoryPoints += gainedPoints;
      
      return `成功地将宗教传播到新地区，转换了${converted}张学术资源为${gainedPoints}胜利点`;
    }
    
    return '没有学术资源可以用于宗教传播';
  }
  
  // 触发技术革新事件 (正面)
  triggerTechnology(player) {
    const choices = [
      { id: 1, name: '骆驼升级', effect: '每回合额外获得1AP' },
      { id: 2, name: '船只改良', effect: '海上遭遇负面事件时有50%几率自动抵消' },
      { id: 3, name: '贸易网络扩展', effect: '每次交易可额外获得1资源' }
    ];
    
    const choiceList = choices.map(c => `${c.id}=${c.name}: ${c.effect}`).join(', ');
    const selectedId = prompt(`选择一项技术革新: ${choiceList}`);
    const id = parseInt(selectedId);
    
    if (isNaN(id) || id < 1 || id > choices.length) {
      return '无效的选择，未获得技术升级';
    }
    
    const selected = choices.find(c => c.id === id);
    
    switch(id) {
      case 1:
        // 骆驼升级
        this.registerEvent('camelUpgrade', player, -1); // 永久效果
        player.specialAbilities.extraActionPoint = true;
        break;
      case 2:
        // 船只改良
        this.registerEvent('shipImprovement', player, -1); // 永久效果
        player.specialAbilities.seaEventResistance = true;
        break;
      case 3:
        // 贸易网络扩展
        this.registerEvent('tradeNetworkExpansion', player, -1); // 永久效果
        player.specialAbilities.bonusTradeResource = true;
        break;
    }
    
    return `成功研发了【${selected.name}】技术: ${selected.effect}`;
  }
  
  // 处理抽取到事件卡
  // 修改handleEventCard方法支持多语言
  handleEventCard(card, player) {
    const lang = window.currentLanguage || 'zh';
    console.log(`${player.name} ${lang === 'en' ? 'drew event card' : '抽到了事件卡'}: ${card.getDisplayName(lang)}`);
    
    let message = '';
    
    switch(card.subtype) {
      case 'mongolEmpire':
        message = this.triggerMongolEmpire(player);
        break;
      case 'zhengHe':
        message = this.triggerZhengHe(player);
        break;
      case 'marcopolo':
        message = this.triggerMarcoPolo(player);
        break;
      case 'religion':
        message = this.triggerReligion(player);
        break;
      case 'technology':
        message = this.triggerTechnology(player);
        break;
      case 'pirate':
        message = this.triggerBandits(player);
        break;
      case 'sandstorm':
        message = this.triggerSandstorm(player);
        break;
      case 'bandits':
        message = this.triggerBandits(player);
        break;
      case 'slaveRevolt':
        message = this.triggerSlaveRevolt(player);
        break;
      default:
        message = lang === 'en' ? 'Unknown event card, no effect' : '未知事件卡，无效果';
        break;
    }
    
    const eventTitle = lang === 'en' ? 'Event Triggered' : '事件触发';
    alert(`${eventTitle}: ${card.getDisplayName(lang)}\n${message}`);
    return message;
  }
  
  // 清理过期事件
  processEvents() {
    // 在每回合开始时检查并清理过期事件
    this.activeEvents = this.activeEvents.filter(event => {
      // 如果是永久效果(duration = -1)，不移除
      if (event.duration === -1) return true;
      
      // 检查是否过期
      const isActive = (this.game.round - event.startedAt) < event.duration;
      
      // 如果事件刚好过期，清除其效果
      if (!isActive) {
        switch (event.type) {
          case 'movementPenalty':
            delete event.player.specialAbilities.movementPenalty;
            break;
          case 'mongolEmpire':
            delete event.player.specialAbilities.reducedMovementCost;
            break;
          case 'zhengHe':
            delete event.player.specialAbilities.indianOceanBonus;
            break;
        }
        
        console.log(`${event.player.name} 的事件 ${event.type} 已过期`);
      }
      
      return isActive;
    });
  }
}