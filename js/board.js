class GameBoard {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.game = null; // 将在game.js中初始化
    
    // 定义三个贸易区域的颜色
    this.colors = {
      silkRoad: '#e9d8a6',      // 丝绸之路(沙色)
      indianOcean: '#94d2bd',   // 印度洋(海蓝色) 
      sahara: '#ee9b00'         // 撒哈拉(橙褐色)
    };
    
    // 定义城市节点位置
    this.cities = {
      changan: { x: 100, y: 100, region: 'silkRoad', name: "长安" },
      kashgar: { x: 200, y: 150, region: 'silkRoad', name: "喀什" },
      samarkand: { x: 300, y: 200, region: 'silkRoad', name: "撒马尔罕" },
      constantinople: { x: 400, y: 100, region: 'silkRoad', name: "君士坦丁堡" },
      guangzhou: { x: 150, y: 350, region: 'indianOcean', name: "广州" },
      calcutta: { x: 250, y: 400, region: 'indianOcean', name: "加尔各答" },
      aden: { x: 350, y: 450, region: 'indianOcean', name: "亚丁" },
      venice: { x: 450, y: 350, region: 'indianOcean', name: "威尼斯" },
      timbuktu: { x: 550, y: 150, region: 'sahara', name: "廷巴克图" },
      gao: { x: 600, y: 250, region: 'sahara', name: "加奥" },
      tangier: { x: 650, y: 350, region: 'sahara', name: "丹吉尔" }
    };
    
    // 定义资源点位置
    this.resourcePoints = [
      { x: 150, y: 120, type: 'oasis', region: 'silkRoad' },
      { x: 250, y: 175, type: 'caravan', region: 'silkRoad' },
      { x: 350, y: 150, type: 'oasis', region: 'silkRoad' },
      { x: 200, y: 350, type: 'port', region: 'indianOcean' },
      { x: 300, y: 420, type: 'port', region: 'indianOcean' },
      { x: 400, y: 380, type: 'market', region: 'indianOcean' },
      { x: 575, y: 200, type: 'oasis', region: 'sahara' },
      { x: 625, y: 300, type: 'salt', region: 'sahara' }
    ];
    
    // 定义危险区域
    this.dangerZones = [
      { x: 175, y: 150, type: 'sandstorm', region: 'silkRoad' },
      { x: 325, y: 175, type: 'bandits', region: 'silkRoad' },
      { x: 275, y: 125, type: 'bandits', region: 'silkRoad' },
      { x: 200, y: 400, type: 'pirates', region: 'indianOcean' },
      { x: 400, y: 420, type: 'monsoon', region: 'indianOcean' },
      { x: 575, y: 250, type: 'sandstorm', region: 'sahara' },
      { x: 600, y: 200, type: 'slaveRevolt', region: 'sahara' }
    ];
    
    // 添加到GameBoard类中，在现有属性定义后添加
    this.nameTranslations = {
      cities: {
        'changan': { zh: '长安', en: 'Chang\'an' },
        'kashgar': { zh: '喀什', en: 'Kashgar' },
        'samarkand': { zh: '撒马尔罕', en: 'Samarkand' },
        'constantinople': { zh: '君士坦丁堡', en: 'Constantinople' },
        'guangzhou': { zh: '广州', en: 'Guangzhou' },
        'calcutta': { zh: '加尔各答', en: 'Calcutta' },
        'aden': { zh: '亚丁', en: 'Aden' },
        'venice': { zh: '威尼斯', en: 'Venice' },
        'timbuktu': { zh: '廷巴克图', en: 'Timbuktu' },
        'gao': { zh: '加奥', en: 'Gao' },
        'tangier': { zh: '丹吉尔', en: 'Tangier' }
      },
      resources: {
        'oasis': { zh: '绿洲', en: 'Oasis' },
        'caravan': { zh: '商队驿站', en: 'Caravan Stop' },
        'market': { zh: '市场', en: 'Market' },
        'port': { zh: '港口', en: 'Port' },
        'salt': { zh: '盐矿', en: 'Salt Mine' }
      },
      dangers: {
        'sandstorm': { zh: '沙漠风暴', en: 'Sandstorm' },
        'bandits': { zh: '强盗出没', en: 'Bandits' },
        'pirates': { zh: '海盗袭击', en: 'Pirates' },
        'monsoon': { zh: '季风区域', en: 'Monsoon' },
        'slaveRevolt': { zh: '奴隶起义', en: 'Slave Revolt' }
      },
      regions: {
        'silkRoad': { zh: '丝绸之路', en: 'Silk Road' },
        'indianOcean': { zh: '印度洋贸易', en: 'Indian Ocean Trade' },
        'sahara': { zh: '撒哈拉沙漠贸易', en: 'Sahara Desert Trade' }
      }
    };
  }

  // 设置游戏实例引用
  setGame(game) {
    this.game = game;
  }

  drawBoard() {
    this.drawRegions();
    this.drawCities();
    this.drawResourcePoints();
    this.drawDangerZones();
    this.drawPaths();
  }
  
  // 修改 drawRegions 方法
  drawRegions() {
    // 绘制丝绸之路区域
    this.ctx.fillStyle = this.colors.silkRoad;
    this.ctx.beginPath();
    this.ctx.rect(50, 50, 400, 200);
    this.ctx.fill();
    
    // 绘制印度洋区域
    this.ctx.fillStyle = this.colors.indianOcean;
    this.ctx.beginPath();
    this.ctx.rect(50, 300, 400, 200);
    this.ctx.fill();
    
    // 绘制撒哈拉区域
    this.ctx.fillStyle = this.colors.sahara;
    this.ctx.beginPath();
    this.ctx.rect(500, 50, 250, 450);
    this.ctx.fill();
    
    // 添加区域标题 - 使用翻译
    this.ctx.fillStyle = '#000';
    this.ctx.font = 'bold 16px Arial';
    
    const lang = window.currentLanguage || 'zh';
    
    this.ctx.fillText(this.nameTranslations.regions.silkRoad[lang], 60, 70);
    this.ctx.fillText(this.nameTranslations.regions.indianOcean[lang], 60, 320);
    this.ctx.fillText(this.nameTranslations.regions.sahara[lang], 510, 70);
  }
  
  // 绘制城市
  // 修改 drawCities 方法
  drawCities() {
    const lang = window.currentLanguage || 'zh';
    
    Object.entries(this.cities).forEach(([cityId, city]) => {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.arc(city.x, city.y, 10, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.fillStyle = '#000';
      this.ctx.font = '12px Arial';
      // 使用翻译的城市名称
      const cityName = this.nameTranslations.cities[cityId][lang];
      this.ctx.fillText(cityName, city.x - 15, city.y - 15);
    });
  }
  
  // 绘制资源点
  drawResourcePoints() {
    this.resourcePoints.forEach(point => {
      // 根据资源点类型选择不同颜色
      let color = '#4CAF50';  // 默认绿色
      let symbol = '◉';      // 默认符号
      
      switch(point.type) {
        case 'oasis':
          color = '#4CAF50';  // 绿色
          symbol = '♣';
          break;
        case 'caravan':
          color = '#FF9800';  // 橙色
          symbol = '◉';
          break;
        case 'market':
          color = '#E91E63';  // 粉色
          symbol = '⚖';
          break;
        case 'port':
          color = '#2196F3';  // 蓝色
          symbol = '⚓';
          break;
        case 'salt':
          color = '#FFFFFF';  // 白色
          symbol = '◎';
          break;
        default:
          break;
      }
      
      // 绘制资源点圆形背景
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制边框
      this.ctx.strokeStyle = '#000';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // 绘制资源点类型符号
      this.ctx.fillStyle = '#000';
      this.ctx.font = '10px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(symbol, point.x, point.y);
      
      // 绘制资源点名称
      this.ctx.fillStyle = '#000';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(this.getResourcePointName(point.type), point.x, point.y + 20);
    });
  }
  
  // 修改 getResourcePointName 方法
  getResourcePointName(type) {
    const lang = window.currentLanguage || 'zh';
    return this.nameTranslations.resources[type] ? 
      this.nameTranslations.resources[type][lang] : type;
  }
  
  // 绘制危险区域
  drawDangerZones() {
    this.dangerZones.forEach(zone => {
      // 根据危险区域类型选择不同颜色
      let color = 'rgba(255, 0, 0, 0.2)';  // 默认红色半透明
      let symbol = '⚠';                   // 默认警告符号
      
      switch(zone.type) {
        case 'sandstorm':
          color = 'rgba(244, 164, 96, 0.4)'; // 沙色半透明
          symbol = '≈';
          break;
        case 'bandits':
          color = 'rgba(139, 0, 0, 0.3)';    // 深红色半透明
          symbol = '⚔';
          break;
        case 'pirates':
          color = 'rgba(0, 0, 139, 0.3)';    // 深蓝色半透明
          symbol = '☠';
          break;
        case 'monsoon':
          color = 'rgba(70, 130, 180, 0.3)'; // 深蓝色半透明
          symbol = '❄';
          break;
        case 'slaveRevolt':
          color = 'rgba(0, 100, 0, 0.3)';    // 深绿色半透明
          symbol = '⚒';
          break;
        default:
          break;
      }
      
      // 绘制危险区域
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(zone.x, zone.y, 15, 0, Math.PI * 2);
      this.ctx.fill();
      
      // 绘制危险区域边框
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
      
      // 绘制危险区域符号
      this.ctx.fillStyle = '#000';
      this.ctx.font = '16px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(symbol, zone.x, zone.y);
      
      // 绘制危险区域名称
      this.ctx.fillStyle = '#000';
      this.ctx.font = '10px Arial';
      this.ctx.fillText(this.getDangerZoneName(zone.type), zone.x, zone.y + 20);
    });
  }
  
  // 修改 getDangerZoneName 方法
  getDangerZoneName(type) {
    const lang = window.currentLanguage || 'zh';
    return this.nameTranslations.dangers[type] ? 
      this.nameTranslations.dangers[type][lang] : type;
  }
  
  // 绘制玩家建立的贸易路线
  drawPaths() {
    if (!this.game) return;
    
    // 遍历所有玩家
    this.game.players.forEach(player => {
      // 为每个玩家绘制其路线
      player.routes.forEach(route => {
        // 获取路线起点和终点的坐标
        const fromCity = this.cities[route.from];
        const toCity = this.cities[route.to];
        
        if (fromCity && toCity) {
          // 设置线条颜色为玩家颜色
          this.ctx.strokeStyle = player.color;
          this.ctx.lineWidth = 3;
          
          // 绘制路线
          this.ctx.beginPath();
          this.ctx.moveTo(fromCity.x, fromCity.y);
          this.ctx.lineTo(toCity.x, toCity.y);
          this.ctx.stroke();
          
          // 绘制小旗标记
          const midX = (fromCity.x + toCity.x) / 2;
          const midY = (fromCity.y + toCity.y) / 2;
          
          // 绘制旗杆
          this.ctx.beginPath();
          this.ctx.moveTo(midX, midY);
          this.ctx.lineTo(midX, midY - 10);
          this.ctx.stroke();
          
          // 绘制旗帜
          this.ctx.fillStyle = player.color;
          this.ctx.beginPath();
          this.ctx.moveTo(midX, midY - 10);
          this.ctx.lineTo(midX + 7, midY - 7);
          this.ctx.lineTo(midX, midY - 4);
          this.ctx.fill();
          
          // 如果路线是加固的，绘制双线
          if (route.reinforced) {
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(fromCity.x, fromCity.y);
            this.ctx.lineTo(toCity.x, toCity.y);
            this.ctx.stroke();
          }
        }
      });
    });
    
    // 绘制已完成的完整路线特殊标记
    this.game.players.forEach(player => {
      const completedRoutes = this.getCompletedRoutes(player);
      
      completedRoutes.forEach(route => {
        // 获取路线起点和终点的坐标
        const startCity = this.cities[route.from];
        const endCity = this.cities[route.to];
        
        if (startCity && endCity) {
          // 绘制完整路线特效（如金色光晕）
          const gradient = this.ctx.createLinearGradient(
            startCity.x, startCity.y, endCity.x, endCity.y
          );
          gradient.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
          gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 215, 0, 0.2)');
          
          this.ctx.strokeStyle = gradient;
          this.ctx.lineWidth = 6;
          this.ctx.beginPath();
          this.ctx.moveTo(startCity.x, startCity.y);
          this.ctx.lineTo(endCity.x, endCity.y);
          this.ctx.stroke();
          
          // 在路线中点绘制星标
          const midX = (startCity.x + endCity.x) / 2;
          const midY = (startCity.y + endCity.y) / 2;
          
          this.ctx.fillStyle = 'gold';
          this.drawStar(midX, midY, 5, 10, 5);
        }
      });
    });
  }
  
  // 绘制星形
  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;
    
    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
      
      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
  
  // 获取玩家已完成的路线
  getCompletedRoutes(player) {
    if (!this.game) return [];
    
    const completeRoutes = [
      { from: 'changan', to: 'constantinople', region: 'silkRoad', name: '丝绸之路' },
      { from: 'guangzhou', to: 'venice', region: 'indianOcean', name: '海上丝绸之路' },
      { from: 'timbuktu', to: 'tangier', region: 'sahara', name: '撒哈拉贸易路线' }
    ];
    
    // 过滤出玩家已完成的路线
    return completeRoutes.filter(route => {
      return this.game.isRouteConnected(route.from, route.to, player.routes);
    });
  }
  
  // 检查点击区域，用于处理玩家交互
  checkClick(x, y) {
    // 检查城市点击
    for (const [cityId, city] of Object.entries(this.cities)) {
      if (Math.sqrt(Math.pow(city.x - x, 2) + Math.pow(city.y - y, 2)) < 15) {
        return { type: 'city', id: cityId, data: city };
      }
    }
    
    // 检查资源点点击
    for (let i = 0; i < this.resourcePoints.length; i++) {
      const point = this.resourcePoints[i];
      if (Math.sqrt(Math.pow(point.x - x, 2) + Math.pow(point.y - y, 2)) < 10) {
        return { type: 'resource', id: i, data: point };
      }
    }
    
    // 检查危险区域点击
    for (let i = 0; i < this.dangerZones.length; i++) {
      const zone = this.dangerZones[i];
      if (Math.sqrt(Math.pow(zone.x - x, 2) + Math.pow(zone.y - y, 2)) < 15) {
        return { type: 'danger', id: i, data: zone };
      }
    }
    
    return { type: 'empty', x, y };
  }

  
}