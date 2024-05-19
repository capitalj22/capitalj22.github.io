import { each, map } from "lodash-es";
import './inputs.scss';

function ImageFileInput({ label, uploaded }) {
  const handleFileUpload = (e) => {
    const files = [...e.target.files];
    const mappedFiles = map(files, (file) => ({
      name: file.name,
      cardNumber: file.name.split('.')[0],
      url: URL.createObjectURL(file),
    }));

    uploaded(mappedFiles);
  };

  return (
    <div className="file-input">
      <span>{label}</span>
      <input
        type="file"
        onChange={handleFileUpload}
        accept="image/*"
        multiple
      />
    </div>
  );
}

export default ImageFileInput;
