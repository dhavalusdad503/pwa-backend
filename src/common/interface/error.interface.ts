export interface PostgresDriverError {
  code?: string;
  detail?: string;
  column?: string;
}
