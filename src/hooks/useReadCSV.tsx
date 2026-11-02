import Papa from "papaparse"
import type {ParseResult} from "papaparse";
import * as React from "react";

type CSVRow = string[];

const useReadCSV = () => {
    const [values, setValues] = React.useState<ParseResult<CSVRow> | undefined>();

    const getCSV = () => {
        Papa.parse(`${import.meta.env.BASE_URL}etumeFan.csv`, {
            header: false,
            download: true,
            skipEmptyLines: true,
            delimiter: ",",
            complete: (results: ParseResult<CSVRow>) => {
                setValues(results)
            },
        })
    }


    React.useEffect(() => {
        getCSV()
    }, [])

    return values;
}

export default useReadCSV

