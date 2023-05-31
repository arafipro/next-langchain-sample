import { CharacterTextSplitter } from "langchain/text_splitter";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export default async function Home() {
  const loader = new PDFLoader("data/pg.pdf", {
    splitPages: false,
  });
  const res_pdf = await loader.load();
  const str = res_pdf[0].pageContent.replace(/\n/g, " ").replace(/,/g, "");
  const splitter = new CharacterTextSplitter({
    separator: " ",
    chunkSize: 512,
    chunkOverlap: 24,
  });
  const output = await splitter.createDocuments([str]);
	console.log(output);

  return (
    <main>
      <h1 className="text-center text-3xl">langchain</h1>
    </main>
  );
}
