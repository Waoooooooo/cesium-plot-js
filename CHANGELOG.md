
---

## v0.0.7

---
#### ✨新功能
- 新增提示框功能（2025-04-09）
- 支持右键取消编辑（2025-04-29）

#### 🐎 性能优化
- 优化提示框的显示逻辑（2025-04-29）

#### ⚠️ 重大变更

- 将circle修改成正圆,以前是椭圆 (2025-04-10)
- 控制点不再被地形和3dtiles遮挡 
- 在3dtiles上,鼠标长按空白区域时取消编辑状态 

#### 🐞 Bug修复

- 修复多边形标绘只有一个点时,双击会报错的问题(2025-04-09)
- 修复在开始绘制圆形时双击的逻辑错误和显示bug(2025-04-14)

---

## 0.0.6

---

#### ✨ New Features

- 新增: 绘制扇形

- 新增: 根据数据回显图形

- 新增: 获取图形关键点位方法：`getPoints`


#### 🐞 Bug fixes

- 修复：绘制过程中临时创建的线没有被删除的问题

- 修复：双击控制点导致图形无法拖拽的问题

- 修复：双箭头执行生长动画后，编辑状态无法拖拽的问题

- 修复：双箭头整体被拖拽后生长动画路径不正确的问题


## 0.0.5

---

#### ✨ New Features

- Add: Fade-in Fade-out Animation for Graphics

- Add: Growing Animation for Arrow-shaped Graphics

#### ⚠️ Breaking changes 

- Set Default Style to Cesium Default Style

#### 🐞 Bug fixes

- Disable Cesium's Auto-Centering Viewport Behavior on Double Click


## 0.0.4

---

#### ✨ New Features

- Adding ES Module package to the published package

#### 🐞 Bug fixes

- Fix the issue where polygons and triangles cannot delete their outer edges when removed.

### 0.0.3

---

#### ✨ New Features

- Publish to CDN and NPM

## 0.0.2

---

#### ✨ New Features

- Adding graphical drawing capabilities:
Triangle
Polygon
Circle

## 0.0.1

---

#### ✨ New Features

- Adding graphical drawing capabilities:
  FineArrow
  AttackArrow
  SwallowtailAttackArrow
  SquadCombat
  SwallowtailSquadCombat
  StraightArrow
  CurvedArrow
  AssaultDirection
  DoubleArrow
  FreehandLine
  FreehandPolygon
  Curve
  Ellipse
  Lune
  Reactangle
