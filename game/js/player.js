class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.position = null;      // 当前位置
    this.previousPosition = null; // 上一个位置（用于回退）
    this.hand = [];            // 手牌
    this.victoryPoints = 0;    // 胜利点
    this.culturalPoints = 0;   // 文化点
    this.routes = [];          // 已铺设的路线
    this.secretTasks = [];     // 秘密任务
    this.actionPoints = 3;     // 行动点数
    this.specialAbilities = {}; // 特殊能力
  }
  
  // 移动到新位置
  moveTo(newPosition) {
    if (this.actionPoints > 0) {
      this.previousPosition = this.position; // 保存上一位置用于回退
      this.position = newPosition;
      this.actionPoints--;
      return true;
    }
    return false;
  }
  
  // 添加卡片到手牌
  addCard(card) {
    if (card) {
      this.hand.push(card);
      return true;
    }
    return false;
  }
  
  // 使用卡片
  useCard(cardIndex) {
    if (cardIndex >= 0 && cardIndex < this.hand.length) {
      const card = this.hand[cardIndex];
      this.hand.splice(cardIndex, 1);
      return card;
    }
    return null;
  }
  
  // 建立贸易路线
  establishRoute(from, to, resources) {
    // 检查资源是否足够
    const requiredCards = resources.map(r => this.findCardInHand(r)).filter(Boolean);
    
    if (requiredCards.length === resources.length) {
      // 从手中移除这些卡
      requiredCards.forEach(card => {
        const index = this.hand.indexOf(card);
        if (index !== -1) this.hand.splice(index, 1);
      });
      
      // 检查是否为强化路线
      let reinforced = false;
      if ((resources.includes('silk') && resources.includes('porcelain')) || 
          (resources.includes('textile') && resources.includes('academic'))) {
        reinforced = true;
      }
      
      // 添加路线
      this.routes.push({ 
        from, 
        to, 
        reinforced 
      });
      
      console.log(`玩家 ${this.name} 建立了从 ${from} 到 ${to} 的路线${reinforced ? ' (加固)' : ''}`);
      return true;
    }
    return false;
  }
  
  // 寻找特定类型的卡片
  findCardInHand(type) {
    return this.hand.find(card => card.subtype === type);
  }
  
  // 重置行动点
  resetActionPoints() {
    this.actionPoints = 3;
    
    // 应用特殊能力影响
    if (this.specialAbilities.extraActionPoint) {
      this.actionPoints++;
    }
    
    // 移动惩罚
    if (this.specialAbilities.movementPenalty) {
      this.actionPoints = Math.ceil(this.actionPoints / 2);
      delete this.specialAbilities.movementPenalty;
    }
  }
  
  // 投入文化工程
  investInCulture(cardIndex) {
    if (cardIndex >= 0 && cardIndex < this.hand.length) {
      const card = this.hand[cardIndex];
      
      if (card.type === 'resource') {
        let culturalValue = 0;
        
        if (card.subtype === 'academic') {
          culturalValue = 3;
        } else if (card.subtype === 'textile') {
          culturalValue = 2;
        } else {
          culturalValue = 1;
        }
        
        // 如果使用奴隶卡，减少文化点
        if (card.subtype === 'slave') {
          this.culturalPoints = Math.max(0, this.culturalPoints - 1);
        }
        
        this.culturalPoints += culturalValue;
        this.hand.splice(cardIndex, 1);
        
        console.log(`${this.name} 投资 ${card.getDisplayName()} 于文化工程，获得 ${culturalValue} 文化点`);
        return culturalValue;
      }
    }
    return 0;
  }
  
  // 计算总分
  calculateScore() {
    let total = this.victoryPoints;
    
    // 资源财富计分
    const resourcePoints = this.hand.reduce((sum, card) => {
      return sum + (card.type === 'resource' ? card.value : 0);
    }, 0);
    total += Math.floor(resourcePoints / 10);
    
    // 文化影响计分
    total += Math.floor(this.culturalPoints / 5);
    
    // 秘密任务计分 (简单实现)
    this.secretTasks.forEach(task => {
      if (task.completed) {
        total += task.reward;
      } else if (task.failed) {
        total -= task.penalty;
      }
    });
    
    return total;
  }
  
  // 检查秘密任务完成情况
  checkSecretTasks(game) {
    this.secretTasks.forEach(task => {
      // 这里根据不同任务类型实现各种检查逻辑
      // 简化版：每个任务都有自己的检查函数
      if (task.checkCompletion && typeof task.checkCompletion === 'function') {
        const result = task.checkCompletion(this, game);
        if (result) {
          task.completed = true;
          console.log(`${this.name} 完成了秘密任务: ${task.description}`);
        }
      }
    });
  }
}