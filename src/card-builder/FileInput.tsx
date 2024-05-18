import { each } from "lodash-es";
import * as XLSX from "xlsx";

function FileInput({ fileChanged }) {
  const sheets = [];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "binary" });
      each(workbook.SheetNames, (name) => {
        sheets.push(XLSX.utils.sheet_to_json(workbook.Sheets[name]));
      });

      fileChanged(sheets);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}

export default FileInput;
