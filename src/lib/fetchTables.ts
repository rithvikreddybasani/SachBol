import { supabase } from './supabase';

export const fetchTables = async () => {
  try {
    // Get all tables from the public schema
    const { data: tables, error } = await supabase
      .rpc('get_tables');

    if (error) {
      console.error('Error:', error);
      return [];
    }

    return tables;
  } catch (error) {
    console.error('Error fetching tables:', error);
    return [];
  }
};

export const getTableSchema = async (tableName: string) => {
  try {
    const { data: columns, error } = await supabase
      .rpc('get_table_schema', { table_name: tableName });

    if (error) {
      console.error('Error:', error);
      return [];
    }

    return columns;
  } catch (error) {
    console.error('Error fetching table schema:', error);
    return [];
  }
};