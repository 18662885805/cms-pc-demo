import XLSX from "xlsx";
import { message } from "antd";

export const exportExcel = (selectedRows, column, fileName) => {
  const columnMap = {};
  column.forEach((c, index) => {
    if (c.dataIndex === "avatar") {
      return;
    }
    columnMap[c.dataIndex] = {
      title: c.title,
      sort: index
    };
  });
  const columnMapPair = Object.keys(columnMap);
  const rows = Array.isArray(selectedRows) && selectedRows.map(row => {
    let obj = {};
    for (let k in row) {
      let idx = columnMapPair.indexOf(k);
      if (idx > -1) {
        if (row[k] === null || row[k] === "") {
          row[k] = "空";
        } else if (Array.isArray(row[k])) {
          row[k] = row[k].reduce((a, b) => a + " " + b);
        }
        obj[columnMap[columnMapPair[idx]].title] = row[k];
      }
    }
    return obj;
  });

  if (rows.length > 0) {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws);
    return XLSX.writeFile(wb, `${fileName}.xlsx`);
  } else {
    message.warning("请选择要导出的数据");
  }
};
