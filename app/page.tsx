import { loadQAMapReduceChain } from "langchain/chains";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export default async function Home() {
	const loader = new PDFLoader(
		"data/pg.pdf",
		// "/Users/macbookhiro/Desktop/Project/NextProject/next-langchain-sample/data/pg.pdf",フルパスはOK
		// "https://s1.q4cdn.com/695946674/files/doc_news/2023/10/FY2324-Q1-JAS-Release.pdf",ネットから取得はできない
    {
      splitPages: false,
    }
  );
  const res_pdf = await loader.load();
  const str = res_pdf[0].pageContent.replace(/\n/g, " ").replace(/,/g, "");
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 512,
    chunkOverlap: 24,
  });
  const output = await splitter.createDocuments([str]);
  const model = new OpenAI({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const store = await MemoryVectorStore.fromDocuments(output, embeddings);
  const question = "What is the name of your company?"; //会社名は何ですか？
  const relevantDocs = await store.similaritySearch(question);
  const chain = loadQAMapReduceChain(model);
  const res = await chain.call({
    input_documents: relevantDocs,
    question,
  });
  return (
    <main>
      <h1 className="text-center text-3xl">langchain</h1>
      <p className="text-center pt-2">{res.text}</p>
    </main>
  );
}
