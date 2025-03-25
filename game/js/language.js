// 语言配置
const translations = {
  'zh': {
    'game_title': '古代贸易网络大冒险',
    'player_count': '玩家数量:',
    'start_game': '开始游戏',
    'next_phase': '下一阶段',
    'draw_card': '抽取卡牌',
    'build_route': '建立路线',
    'trade': '发起交易',
    'round': '回合',
    'phase': '阶段',
    'current_action': '当前行动',
    'action_points': '行动点',
    'player': '玩家',
    'color': '颜色',
    'victory_points': '胜利点',
    'cultural_points': '文化点',
    'hand_cards': '手牌',
    'secret_tasks': '秘密任务',
    'resource_deck': '资源牌堆',
    'event_deck': '事件牌堆',
    'discard_pile': '弃牌堆',
    'confirm': '确认',
    'cancel': '取消',
    'planning_phase': '准备与规划阶段',
    'movement_phase': '移动阶段',
    'trading_phase': '交易与互动阶段',
    'building_phase': '建设与文化工程阶段',
    'ending_phase': '结束阶段',
    'game_over': '游戏结束!',
    'new_game': '开始新游戏',
    'tooltip_draw_no_ap': '没有足够的行动点',
    'tooltip_draw_wrong_phase': '当前阶段不能抽卡',
    'tooltip_draw_ok': '使用1行动点抽取一张卡牌',
    'tooltip_route_wrong_phase': '当前阶段不能建立路线',
    'tooltip_route_ok': '使用资源建立贸易路线',
    'tooltip_trade_wrong_phase': '当前阶段不能交易',
    'tooltip_trade_ok': '与其他玩家交换资源'
  },
  'en': {
    'game_title': 'Ancient Trade Network Adventure',
    'player_count': 'Player Count:',
    'start_game': 'Start Game',
    'next_phase': 'Next Phase',
    'draw_card': 'Draw Card',
    'build_route': 'Build Route',
    'trade': 'Trade',
    'round': 'Round',
    'phase': 'Phase',
    'current_action': 'Current Action',
    'action_points': 'Action Points',
    'player': 'Player',
    'color': 'Color',
    'victory_points': 'Victory Points',
    'cultural_points': 'Cultural Points',
    'hand_cards': 'Hand Cards',
    'secret_tasks': 'Secret Tasks',
    'resource_deck': 'Resource Deck',
    'event_deck': 'Event Deck',
    'discard_pile': 'Discard Pile',
    'confirm': 'Confirm',
    'cancel': 'Cancel',
    'planning_phase': 'Planning Phase',
    'movement_phase': 'Movement Phase',
    'trading_phase': 'Trading Phase',
    'building_phase': 'Building Phase',
    'ending_phase': 'Ending Phase',
    'game_over': 'Game Over!',
    'new_game': 'New Game',
    'tooltip_draw_no_ap': 'Not enough action points',
    'tooltip_draw_wrong_phase': "Can't draw cards in this phase",
    'tooltip_draw_ok': 'Use 1 action point to draw a card',
    'tooltip_route_wrong_phase': "Can't build routes in this phase",
    'tooltip_route_ok': 'Use resources to build a trade route',
    'tooltip_trade_wrong_phase': "Can't trade in this phase",
    'tooltip_trade_ok': 'Exchange resources with other players'
  }
};

// 确保变量和函数在全局范围
window.currentLanguage = 'zh';

// 全局翻译函数
window.translate = function(key) {
  return translations[window.currentLanguage][key] || key;
};

// 全局语言切换函数
window.switchLanguage = function(lang) {
  if (translations[lang]) {
    window.currentLanguage = lang;
    
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`)?.classList.add('active');
    
    // 更新UI元素
    updateInterfaceLanguage();
    
    // 保存语言选择
    localStorage.setItem('gameLanguage', lang);
  }
};

// 更新界面语言
function updateInterfaceLanguage() {
  // 游戏标题
  const mainTitle = document.querySelector('h1');
  if (mainTitle) mainTitle.textContent = window.translate('game_title');
  
  const subTitle = document.querySelector('h2');
  if (subTitle) subTitle.textContent = window.translate('game_title');
  
  // 配置页面
  const playerCountLabel = document.getElementById('label-player-count');
  if (playerCountLabel) playerCountLabel.textContent = window.translate('player_count');
  
  const startGameBtn = document.getElementById('start-game-btn');
  if (startGameBtn) startGameBtn.textContent = window.translate('start_game');
  
  // 游戏操作按钮
  const nextPhaseBtn = document.getElementById('next-phase-btn');
  if (nextPhaseBtn) nextPhaseBtn.textContent = window.translate('next_phase');
  
  const drawCardBtn = document.getElementById('draw-card-btn');
  if (drawCardBtn) drawCardBtn.textContent = window.translate('draw_card');
  
  const buildRouteBtn = document.getElementById('build-route-btn');
  if (buildRouteBtn) buildRouteBtn.textContent = window.translate('build_route');
  
  const tradeBtn = document.getElementById('trade-btn');
  if (tradeBtn) tradeBtn.textContent = window.translate('trade');
  
  // 牌堆区域
  const resourceDeck = document.getElementById('resource-deck');
  if (resourceDeck) resourceDeck.textContent = window.translate('resource_deck');
  
  const eventDeck = document.getElementById('event-deck');
  if (eventDeck) eventDeck.textContent = window.translate('event_deck');
  
  const discardPile = document.getElementById('discard-pile');
  if (discardPile) discardPile.textContent = window.translate('discard_pile');
  
  // 如果游戏已开始，更新游戏内文本
  if (window.game) {
    // 更新阶段信息
    window.game.updateUI();
  }
}

// 初始化语言设置
document.addEventListener('DOMContentLoaded', function() {
  // 检查是否有保存的语言设置
  const savedLanguage = localStorage.getItem('gameLanguage');
  if (savedLanguage && translations[savedLanguage]) {
    window.switchLanguage(savedLanguage);
  }
  
  // 添加语言按钮事件监听器
  document.getElementById('lang-zh')?.addEventListener('click', function() {
    window.switchLanguage('zh');
  });
  
  document.getElementById('lang-en')?.addEventListener('click', function() {
    window.switchLanguage('en');
  });
});

// 添加语言切换按钮样式
document.head.insertAdjacentHTML('beforeend', `
<style>
.language-switcher {
  margin: 10px 0 20px;
}
.lang-btn {
  background: #f0f0f0;
  border: 1px solid #ccc;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 5px;
}
.lang-btn.active {
  background: #997700;
  color: white;
  border-color: #775500;
}
</style>
`);