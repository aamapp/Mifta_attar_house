import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wyouwojqsujhofsivywe.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5b3V3b2pxc3VqaG9mc2l2eXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODEwODksImV4cCI6MjA5ODA1NzA4OX0.DAgyGWRrzksDY13wfwOuBkcp1q6nPHU8C2ShfclFYY0';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testGet() {
  const { data, error } = await supabase
    .from('mifta_orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
  } else {
    console.log('Successfully fetched', data.length, 'orders');
    if (data.length > 0) {
      console.log('First order details:', {
        id: data[0].id,
        address: data[0].address,
        customer_name: data[0].customer_name
      });
    }
  }
}

testGet();
