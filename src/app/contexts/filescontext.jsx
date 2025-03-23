import React, { createContext, Component } from 'react';

export const FileContext = createContext();

export class FileProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      importedFiles: [],
    };
  }

  componentDidMount() {
    const storedFiles = localStorage.getItem('importedFiles');
    if (storedFiles) {
      try {
        this.setState({ importedFiles: JSON.parse(storedFiles) });
      } catch (error) {
        console.error("Error parsing stored files:", error);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.importedFiles !== prevState.importedFiles && this.state.importedFiles.length > 0) {
      localStorage.setItem('importedFiles', JSON.stringify(this.state.importedFiles));
    }
  }

  getCacheData = (key) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const cacheData = localStorage.getItem(key);
          resolve(JSON.parse(cacheData));
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  };

  formatCachedData = (dataList) => {
    return dataList.map(({ name, data }) => ({
      fileName: name,
      tableData: data,
      headers: Object.keys(data[0] || {}),
    }));
  };

  saveCacheData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  render() {
    return (
      <FileContext.Provider
        value={{
          importedFiles: this.state.importedFiles,
          setImportedFiles: (files) => this.setState({ importedFiles: files }),
          getCacheData: this.getCacheData,
          formatCachedData: this.formatCachedData,
          saveCacheData: this.saveCacheData,
        }}
      >
        {this.props.children}
      </FileContext.Provider>
    );
  }
}

export default FileProvider;
