import { GridColDef } from "@mui/x-data-grid";

type ColumnMetadata<T> = Partial<
  Record<keyof T, { type?: "string" | "number" | "boolean"; valueOptions?: any[]; editable?: boolean }>
>;

export function generateColumns<T>(
  data: T[],
  metadata?: ColumnMetadata<T>
): GridColDef<T>[] {
  if (data.length === 0) return [];

  // Extract keys from the first object (runtime)
  const keys = Object.keys(data[0]) as (keyof T)[];

  const columns: GridColDef<T>[] = keys.map((key) => {
    const meta = metadata?.[key] ?? {};

    return {
      field: key,
      headerName: String(key).charAt(0).toUpperCase() + String(key).slice(1),
      flex: 1,
      type: meta.type ?? (typeof data[0][key] === "number" ? "number" : "string"),
      editable: meta.editable ?? false,
      valueOptions: meta.valueOptions,
    };
  });

  return columns;
}
