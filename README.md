# 古代贸易网络大冒险 (Ancient Trade Network Adventure)

![Game Preview]([https://github.com/YinChingZ/YinChingZ.github.io/preview.jpg](https://github.com/YinChingZ/YinChingZ.github.io/blob/main/preview.jpg))

一个基于HTML5和JavaScript的回合制贸易模拟游戏，玩家将扮演古代商人，在丝绸之路、印度洋贸易路线和撒哈拉沙漠中建立贸易网络。

A turn-based trade simulation game based on HTML5 and JavaScript, where players take on the role of ancient merchants establishing trade networks across the Silk Road, Indian Ocean trade routes, and the Sahara Desert.

[在线试玩 / Play Online](https://yinchingz.github.io/)

## 目录 / Contents
- [游戏概述 / Game Overview](#游戏概述--game-overview)
- [安装与运行 / Installation & Running](#安装与运行--installation--running)
- [游戏规则 / Game Rules](#游戏规则--game-rules)
- [技术实现 / Technical Implementation](#技术实现--technical-implementation)
- [未来计划 / Future Plans](#未来计划--future-plans)

## 游戏概述 / Game Overview

《古代贸易网络大冒险》是一个回合制策略游戏，玩家将在公元9-13世纪的国际贸易背景下进行商业冒险。游戏结合了资源管理、路线建设和事件响应等元素，创造了一个丰富的贸易模拟体验。

Ancient Trade Network Adventure is a turn-based strategy game where players embark on commercial ventures against the backdrop of international trade during the 9th-13th centuries. The game combines elements of resource management, route building, and event response to create an immersive trade simulation experience.

主要特点 / Key Features:
- 三大历史贸易区域：丝绸之路、印度洋贸易和撒哈拉沙漠贸易
- 多样化的资源卡和事件系统
- 秘密任务机制增加游戏策略性
- 支持2-6名玩家
- 中文和英文双语界面

- Three historical trade regions: Silk Road, Indian Ocean Trade, and Sahara Desert Trade
- Diverse resource cards and event system
- Secret mission mechanisms to enhance strategic gameplay
- Supports 2-6 players
- Bilingual interface in Chinese and English

## 安装与运行 / Installation & Running

### 在线游玩 / Play Online
访问[在线版本](https://yinchingz.github.io/game/)即可开始游戏。

Visit the [online version](https://yinchingz.github.io/game/) to start playing immediately.

### 本地运行 / Local Setup
1. 克隆仓库 / Clone the repository:
```
git clone https://github.com/YinChingZ/YinChingZ.github.io.git
```

2. 进入游戏目录 / Navigate to the game directory:
```
cd YinChingZ.github.io/game
```

3. 使用任意HTTP服务器启动，例如Python的SimpleHTTPServer / Use any HTTP server to launch, e.g., Python's SimpleHTTPServer:
```
python -m http.server 8000
```

4. 在浏览器中访问 / Access in your browser: `http://localhost:8000`

## 游戏规则 / Game Rules

### 游戏目标 / Game Objective
成为最成功的商人，通过建立贸易路线、收集资源和完成秘密任务来获取最多的胜利点数。

Become the most successful merchant by establishing trade routes, collecting resources, and completing secret missions to gain the most victory points.

### 游戏组件 / Game Components
- **游戏板 / Game Board**: 展示三大贸易区域、城市、资源点和危险区域
- **资源卡 / Resource Cards**: 包括丝绸、瓷器、香料、黄金、盐、奴隶、纺织品和学术资源
- **事件卡 / Event Cards**: 包含正面和负面事件，影响游戏进程
- **玩家标记 / Player Markers**: 表示玩家在游戏板上的位置
- **路线标记 / Route Markers**: 表示已建立的贸易路线
- **秘密任务 / Secret Missions**: 提供额外获取分数的机会

- **Game Board**: Displays the three trade regions, cities, resource points, and danger zones
- **Resource Cards**: Including silk, porcelain, spices, gold, salt, slaves, textiles, and academic resources
- **Event Cards**: Containing positive and negative events that affect game progression
- **Player Markers**: Representing players' positions on the game board
- **Route Markers**: Indicating established trade routes
- **Secret Missions**: Providing opportunities to earn additional points

### 游戏设置 / Game Setup
1. 选择玩家人数（2-6人）
2. 每位玩家获得5张初始资源卡
3. 每位玩家获得1-2张秘密任务
4. 玩家起始位置分配在长安、广州或廷巴克图

1. Choose the number of players (2-6)
2. Each player receives 5 initial resource cards
3. Each player receives 1-2 secret missions
4. Players' starting positions are assigned at Chang'an, Guangzhou, or Timbuktu

### 回合流程 / Turn Flow
每个回合分为5个阶段，玩家依次执行：

Each turn is divided into 5 phases, which players execute in sequence:

1. **准备与规划阶段 / Planning Phase**: 玩家准备本轮行动 / Players prepare for their actions
2. **移动阶段 / Movement Phase**: 使用行动点移动到新城市或位置 / Use action points to move to new cities or locations
3. **交易与互动阶段 / Trading Phase**: 与其他玩家交换资源或从市场/港口获取资源 / Exchange resources with other players or acquire resources from markets/ports
4. **建设与文化工程阶段 / Building Phase**: 建立贸易路线或投资文化工程 / Establish trade routes or invest in cultural projects
5. **结束阶段 / Ending Phase**: 回合结算，检查是否触发特殊事件 / End turn settlement and check for special events

### 详细规则 / Detailed Rules

#### 行动点 / Action Points
- 每位玩家每回合开始时获得3个行动点
- 行动点可用于：移动、抽取资源卡、与资源点互动

- Each player receives 3 action points at the beginning of their turn
- Action points can be used for: movement, drawing resource cards, interacting with resource points

#### 移动 / Movement
- 玩家可以使用1行动点移动到相邻城市
- 移动可能触发危险区域事件

- Players can use 1 action point to move to an adjacent city
- Movement may trigger danger zone events

#### 资源卡 / Resource Cards
- 资源卡用于建立路线、交易或投资文化工程
- 通过抽牌、交易或与资源点互动获得新资源卡

- Resource cards are used for establishing routes, trading, or investing in cultural projects
- New resource cards can be acquired through drawing, trading, or interacting with resource points

资源卡种类 / Resource Card Types:
- **丝绸/瓷器 / Silk/Porcelain**: 用于铺设陆上贸易路线 / Used for establishing land trade routes
- **香料 / Spices**: 可作为交易媒介 / Can serve as trading medium
- **黄金 / Gold**: 可贿赂海盗或强盗 / Can bribe pirates or bandits
- **盐 / Salt**: 低成本补给 / Low-cost supplies
- **奴隶 / Slaves**: 使用后扣除文化点，但可增加行动点 / Deducts cultural points when used but can increase action points
- **纺织品 / Textiles**: 用于文化工程和路线加固 / For cultural projects and route reinforcement
- **学术资源 / Academic Resources**: 直接投入文化工程 / Direct investment in cultural projects

#### 建立贸易路线 / Establishing Trade Routes
- 在建设阶段，玩家可以使用2张资源卡建立城市间的路线
- 使用丝绸+瓷器或纺织品+学术资源可建立加固路线(更不易受损)
- 连接主要城市形成完整路线可获得大量胜利点

- During the building phase, players can use 2 resource cards to establish routes between cities
- Using silk+porcelain or textiles+academic resources creates reinforced routes (more resistant to damage)
- Connecting major cities to form complete routes awards substantial victory points

主要路线 / Major Routes:
1. **丝绸之路 / Silk Road**: 长安-喀什-撒马尔罕-君士坦丁堡 / Chang'an-Kashgar-Samarkand-Constantinople
2. **海上丝绸之路 / Maritime Silk Road**: 广州-加尔各答-亚丁-威尼斯 / Guangzhou-Calcutta-Aden-Venice
3. **撒哈拉贸易路线 / Sahara Trade Route**: 廷巴克图-加奥-丹吉尔 / Timbuktu-Gao-Tangier

#### 危险区域 / Danger Zones
游戏板上的危险区域可能触发各种事件 / Danger zones on the game board may trigger various events:
- **沙漠风暴 / Sandstorm**: 掷骰子决定效果，可能失去资源、退回或减少下回合移动力 / Roll dice to determine effects; may lose resources, retreat, or reduce movement in the next turn
- **强盗/海盗 / Bandits/Pirates**: 支付黄金或失去随机资源 / Pay gold or lose random resources
- **奴隶起义 / Slave Revolt**: 支付黄金、放弃奴隶卡或接受惩罚 / Pay gold, abandon slave cards, or accept punishment
- **季风区域 / Monsoon Area**: 影响海上贸易路线 / Affects maritime trade routes

#### 文化投资 / Cultural Investment
- 在建设阶段，玩家可以在特定城市（如廷巴克图、撒马尔罕）投资文化工程
- 不同资源卡提供不同数量的文化点数
- 文化点数可以转化为胜利点数

- During the building phase, players can invest in cultural projects in specific cities (like Timbuktu, Samarkand)
- Different resource cards provide varying amounts of cultural points
- Cultural points can be converted into victory points

#### 事件卡 / Event Cards
事件卡可能是有利的或不利的 / Event cards can be beneficial or detrimental:

正面事件 / Positive Events:
- **蒙古帝国崛起 / Mongol Empire Rise**: 丝绸之路移动消耗减少 / Reduced movement cost on the Silk Road
- **郑和航海 / Zheng He's Voyage**: 在港口获得额外资源 / Gain additional resources at ports
- **马可·波罗旅行 / Marco Polo's Travels**: 获得文化点数 / Gain cultural points
- **宗教传播 / Religious Spread**: 可将学术资源转换为胜利点 / Convert academic resources into victory points
- **技术革新 / Technological Innovation**: 选择永久性技术提升 / Choose permanent technology upgrades

负面事件 / Negative Events:
- **海盗袭击 / Pirate Attack**: 失去资源或支付黄金 / Lose resources or pay gold
- **沙漠风暴 / Sandstorm**: 多种不利效果 / Various adverse effects
- **强盗出没 / Bandits**: 失去资源或支付赎金 / Lose resources or pay ransom
- **奴隶起义 / Slave Revolt**: 多种惩罚选择 / Various punishment options

#### 秘密任务 / Secret Missions
每位玩家有秘密目标，完成后可获得额外分数 / Each player has secret objectives that award additional points when completed:
- 在特定回合数内建立特定路线 / Establish specific routes within a set number of turns
- 完成特定路线并进行特定交易 / Complete specific routes and conduct specific trades
- 积累一定数量的文化点 / Accumulate a certain amount of cultural points
- 在特定城市投资文化工程 / Invest in cultural projects in specific cities
- 收集多种不同资源类型 / Collect multiple different resource types

### 游戏结束 / Game End
游戏在以下条件之一满足时结束 / The game ends when one of the following conditions is met:
1. 任一玩家完成了至少两条完整贸易路线 / Any player completes at least two complete trade routes
2. 卡牌抽完80%以上 / Over 80% of cards have been drawn
3. 达到第20回合 / The 20th round is reached

最终计分 / Final Scoring:
1. 胜利点(路线建设和任务完成) / Victory points (route building and mission completion)
2. 资源点(每10点资源价值=1胜利点) / Resource points (every 10 resource value = 1 victory point)
3. 文化点(每5点文化=1胜利点) / Cultural points (every 5 cultural points = 1 victory point)
4. 秘密任务奖励 / Secret mission rewards

## 技术实现 / Technical Implementation

游戏使用纯JavaScript、HTML5和CSS3实现，不依赖任何外部框架：

The game is implemented using pure JavaScript, HTML5, and CSS3, without relying on any external frameworks:

- **Canvas API**: 用于绘制游戏板和所有视觉元素 / Used for drawing the game board and all visual elements
- **JavaScript**: 面向对象设计，实现游戏逻辑 / Object-oriented design for implementing game logic
- **CSS3**: 用于界面样式和动画效果 / For interface styling and animation effects
- **本地存储 / Local Storage**: 保存语言偏好设置 / Saves language preference settings

主要代码模块 / Main Code Modules:
- `game.js`: 游戏核心逻辑 / Core game logic
- `board.js`: 游戏板渲染 / Game board rendering
- `player.js`: 玩家系统 / Player system
- `cards.js`: 卡牌系统 / Card system
- `events.js`: 事件系统 / Event system
- `ui.js`: 用户界面交互 / User interface interaction
- `language.js`: 多语言支持 / Multilingual support

## 未来计划 / Future Plans

1. **游戏平衡调整 / Game Balance Adjustments**: 根据反馈调整各组件平衡性 / Adjust component balance based on feedback
2. **视觉升级 / Visual Upgrades**: 添加更多精美图形和动画 / Add more beautiful graphics and animations
3. **额外扩展 / Additional Expansions**: 增加新的贸易区域和事件类型 / Add new trade regions and event types
4. **保存功能 / Save Function**: 实现游戏进度保存 / Implement game progress saving
5. **多人在线模式 / Online Multiplayer Mode**: 实现网络多人游戏 / Implement online multiplayer gameplay

---

## 致谢 / Acknowledgements
游戏灵感来源于历史上的丝绸之路和古代贸易网络。特别感谢所有提供测试和反馈的朋友们。

The game is inspired by the historical Silk Road and ancient trade networks. Special thanks to all friends who provided testing and feedback.

## 许可证 / License
[MIT](LICENSE)
