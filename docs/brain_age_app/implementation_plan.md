# 脳年齢測定サイト 実装計画

## 目標
ユーザーの「瞬間記憶」と「計算能力」を測定し、脳年齢を算出するWebアプリケーションを作成する。
モダンでプレミアムなUI/UXを提供し、直感的に操作できるデザインを目指す。

## ユーザーレビュー事項
- **脳年齢の算出ロジック**: 科学的な根拠に基づく厳密なものではなく、ゲームスコアに基づくエンターテインメント的な算出（例：スコアが高いほど20歳に近づくなど）とする。
- **デザイン**: ダークモードを基調とした、ネオン/グラスモーフィズムを取り入れたスタイリッシュなデザイン。

## 変更内容

### ディレクトリ構成
```
/
  index.html
  css/
    style.css (main)
    animations.css
  js/
    app.js (main controller)
    memory.js (Instant Memory game)
    math.js (Math Challenge game)
    utils.js
```

### [HTML]
#### [NEW] [index.html](file:///Users/motizuki/.gemini/antigravity/playground/primordial-aldrin/index.html)
- SPA (Single Page Application) ライクな構成。
- `<main>` コンテナ内でコンテンツを動的に切り替える、またはセクションの表示/非表示を切り替える。
- セクション:
  1.  **Home**: タイトル、スタートボタン
  2.  **Game Intro**: ゲームの説明
  3.  **Game Play**: 実際のゲーム画面（Memory / Math）
  4.  **Result**: 結果表示

### [CSS]
#### [NEW] [css/style.css](file:///Users/motizuki/.gemini/antigravity/playground/primordial-aldrin/css/style.css)
- カラーパレット: ディープブルー/パープル (#0f172a) を背景に、鮮やかなアクセントカラー（シアン、マゼンタ）。
- フォント: Google Fonts (Inter, Roboto Mono 等)。
- コンポーネント:
  - `.btn-primary`: 光沢のあるグラデーションボタン。
  - `.card`: グラスモーフィズム効果のあるパネル。

### [JavaScript]
#### [NEW] [js/app.js](file:///Users/motizuki/.gemini/antigravity/playground/primordial-aldrin/js/app.js)
- ゲーム全体のステート管理（現在のゲーム、スコア、進行状況）。
- 画面遷移の制御。

#### [NEW] [js/memory.js](file:///Users/motizuki/.gemini/antigravity/playground/primordial-aldrin/js/memory.js)
- 瞬間記憶ゲームのロジック。
- レベルごとに数字の桁数や表示時間を調整。

#### [NEW] [js/math.js](file:///Users/motizuki/.gemini/antigravity/playground/primordial-aldrin/js/math.js)
- 計算問題のロジック。
- タイムアタック形式。

## 検証計画
### 手動検証
- ブラウザで `index.html` を開き、以下のフローを確認する。
  1.  トップページが表示されること。
  2.  「スタート」ボタンでゲーム説明へ遷移すること。
  3.  瞬間記憶ゲームが正常に動作すること（表示 -> 消える -> 入力 -> 正誤判定）。
  4.  計算問題が正常に動作すること（問題表示 -> 入力 -> 正誤判定）。
  5.  最終結果が表示され、脳年齢が表示されること。
  6.  「もう一度遊ぶ」で最初に戻れること。
