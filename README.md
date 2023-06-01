# Next LangChain Sample

## 開発環境

- Next js 13.4
- TypeScript
- Tailwind CSS

## 簡単な流れ

1. PDFを読み込み
2. 読み込んだデータを分割
3. 分割したデータをembeddingsしてベクトルデータに変換してメモリ上に保存
4. メモリ上に保存したベクトルデータと質問から回答を得る

## 環境変数

- `.env.local.example`を`.env.local`に変更
- `NEXT_PUBLIC_OPENAI_API_KEY`にOpenAI APIのAPIキーを指定

## 簡易サーバー起動

```bash
npm run dev
```

## 読み込むPDF

ディレクトリ`data`に`pg.pdf`を用意
