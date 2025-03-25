class Card {
  constructor(type, subtype, value, effect) {
    this.type = type;         // 卡牌类型：资源卡或事件卡
    this.subtype = subtype;   // 子类型：丝绸、香料、海盗袭击等
    this.value = value;       // 点数值
    this.effect = effect;     // 特殊效果描述
  }
  
  // 创建HTML表示
  // 添加语言参数到createCardElement方法
  createCardElement(lang = 'zh') {
    const card = document.createElement('div');
    card.className = `card ${this.type} ${this.subtype}`;
    
    // 添加标题
    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = this.getDisplayName(lang);
    
    // 添加值
    const value = document.createElement('div');
    value.className = 'card-value';
    value.textContent = this.value > 0 ? 
      (lang === 'en' ? `${this.value} pts` : `${this.value}点`) : '';
    
    // 添加效果说明
    const effect = document.createElement('div');
    effect.className = 'card-effect';
    effect.textContent = this.getEffectText(lang) || '';
    
    card.appendChild(title);
    card.appendChild(value);
    card.appendChild(effect);
    
    return card;
  }
  
  // 修改getDisplayName方法以支持多语言
  getDisplayName(lang = 'zh') {
    const nameMap = {
      'zh': {
        'silk': '丝绸',
        'porcelain': '瓷器',
        'spice': '香料',
        'gold': '黄金',
        'salt': '盐',
        'slave': '奴隶',
        'textile': '纺织品',
        'academic': '学术资源',
        'pirate': '海盗袭击',
        'sandstorm': '沙漠风暴',
        'mongolEmpire': '蒙古帝国崛起',
        'zhengHe': '郑和航海',
        'marcopolo': '马可·波罗旅行',
        'religion': '宗教传播',
        'technology': '技术革新',
        'bandits': '强盗出没',
        'slaveRevolt': '奴隶起义',
        'monsoon': '季风'
      },
      'en': {
        'silk': 'Silk',
        'porcelain': 'Porcelain',
        'spice': 'Spice',
        'gold': 'Gold',
        'salt': 'Salt',
        'slave': 'Slave',
        'textile': 'Textiles',
        'academic': 'Academic Resource',
        'pirate': 'Pirate Attack',
        'sandstorm': 'Sandstorm',
        'mongolEmpire': 'Mongol Empire Rise',
        'zhengHe': 'Zheng He Voyage',
        'marcopolo': 'Marco Polo Travel',
        'religion': 'Religious Spread',
        'technology': 'Technology Innovation',
        'bandits': 'Bandits Attack',
        'slaveRevolt': 'Slave Revolt',
        'monsoon': 'Monsoon'
      }
    };
    
    return nameMap[lang]?.[this.subtype] || this.subtype;
  }

  // 添加获取效果文本的多语言方法
  getEffectText(lang = 'zh') {
    const effectMap = {
      'zh': {
        'silk': '可用于铺设陆上贸易路线',
        'porcelain': '可用于铺设陆上贸易路线',
        'spice': '可作为交易媒介',
        'gold': '可贿赂海盗或强盗',
        'salt': '可作为低成本补给',
        'slave': '使用后扣除文化点，但可增加行动点',
        'textile': '用于文化工程和路线加固',
        'academic': '直接投入文化工程',
        'pirate': '弃掉1随机资源卡，或支付1黄金取消惩罚',
        'sandstorm': '投骰子决定效果',
        'bandits': '支付黄金或失去随机资源',
        'slaveRevolt': '支付1黄金或弃1奴隶卡，否则失去1回合行动'
      },
      'en': {
        'silk': 'Use for establishing land trade routes',
        'porcelain': 'Use for establishing land trade routes',
        'spice': 'Acts as trading medium',
        'gold': 'Can bribe pirates or bandits',
        'salt': 'Low-cost supplies',
        'slave': 'Lose culture points when used, but can gain action points',
        'textile': 'For cultural projects and route reinforcement',
        'academic': 'Direct investment in cultural projects',
        'pirate': 'Discard 1 random resource or pay 1 gold to cancel',
        'sandstorm': 'Roll dice to determine effect',
        'bandits': 'Pay gold or lose a random resource',
        'slaveRevolt': 'Pay 1 gold or discard 1 slave card, or lose 1 turn'
      }
    };
    
    return effectMap[lang]?.[this.subtype] || this.effect;
  }
}

class Deck {
  constructor() {
    this.cards = [];
    this.discardPile = [];
  }
  
  initialize() {
    // 创建资源卡
    this.addResourceCards('silk', 20, 3, '可用于铺设陆上贸易路线');
    this.addResourceCards('porcelain', 20, 3, '可用于铺设陆上贸易路线');
    this.addResourceCards('spice', 15, 2, '可作为交易媒介');
    this.addResourceCards('gold', 15, 4, '可贿赂海盗或强盗');
    this.addResourceCards('salt', 15, 1, '可作为低成本补给');
    this.addResourceCards('slave', 10, 1, '使用后扣除文化点，但可增加行动点');
    this.addResourceCards('textile', 15, 2, '用于文化工程和路线加固');
    this.addResourceCards('academic', 20, 3, '直接投入文化工程');
    
    // 创建事件卡
    this.addEventCards();
    
    // 洗牌
    this.shuffle();
  }
  
  addResourceCards(subtype, count, value, effect) {
    for (let i = 0; i < count; i++) {
      this.cards.push(new Card('resource', subtype, value, effect));
    }
  }
  
  addEventCards() {
    // 添加正面事件卡
    const positiveEvents = [
      { subtype: 'mongolEmpire', effect: '丝绸之路玩家每步消耗减少1AP，持续3回合' },
      { subtype: 'zhengHe', effect: '在印度洋区域每进入港口获得1修复机会和1资源卡' },
      { subtype: 'marcopolo', effect: '增加3文化点' },
      { subtype: 'religion', effect: '可将学术资源转换为胜利点' },
      { subtype: 'technology', effect: '选择一项技术升级' }
    ];
    
    // 添加负面事件卡
    const negativeEvents = [
      { subtype: 'pirate', effect: '弃掉1随机资源卡，或支付1黄金取消惩罚' },
      { subtype: 'sandstorm', effect: '投骰子决定效果' },
      { subtype: 'bandits', effect: '支付黄金或失去随机资源' },
      { subtype: 'slaveRevolt', effect: '支付1黄金或弃1奴隶卡，否则失去1回合行动' }
    ];
    
    // 实际添加事件卡的逻辑
    for (let event of positiveEvents) {
      for (let i = 0; i < 8; i++) {
        this.cards.push(new Card('event', event.subtype, 0, event.effect));
      }
    }
    
    for (let event of negativeEvents) {
      const count = event.subtype === 'pirate' || event.subtype === 'sandstorm' ? 12 : 8;
      for (let i = 0; i < count; i++) {
        this.cards.push(new Card('event', event.subtype, 0, event.effect));
      }
    }
  }
  
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }
  
  draw() {
    if (this.cards.length === 0) {
      if (this.discardPile.length === 0) return null;
      console.log('牌堆已空，重新洗牌...');
      this.cards = [...this.discardPile];
      this.discardPile = [];
      this.shuffle();
    }
    return this.cards.pop();
  }
  
  discard(card) {
    if (card) {
      this.discardPile.push(card);
    } else {
      console.warn('尝试丢弃空卡牌');
    }
  }
  
  // 查看牌堆顶部卡牌但不移除
  peek() {
    if (this.cards.length > 0) {
      return this.cards[this.cards.length - 1];
    }
    return null;
  }
  
  // 获取牌堆剩余数量
  getCount() {
    return this.cards.length;
  }
  
  // 获取弃牌堆数量
  getDiscardCount() {
    return this.discardPile.length;
  }
}