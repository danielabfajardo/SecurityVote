// This file contains SQL functions to be executed in Supabase SQL Editor
// to create the necessary database functions for our application

/*
-- Get budget summary
CREATE OR REPLACE FUNCTION get_budget_summary()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_build_object(
    'total', 15500000,
    'allocated', 10200000,
    'remaining', 5300000,
    'utilizationPercentage', 65.8
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get budget allocation by agency
CREATE OR REPLACE FUNCTION get_budget_allocation_by_agency()
RETURNS json[] AS $$
DECLARE
  result json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'name', agency,
      'value', percentage
    )
  )
  FROM (
    SELECT 
      'Border Patrol' as agency, 
      35 as percentage
    UNION ALL
    SELECT 
      'Cyber Defense' as agency, 
      25 as percentage
    UNION ALL
    SELECT 
      'Intelligence' as agency, 
      20 as percentage
    UNION ALL
    SELECT 
      'Emergency Response' as agency, 
      15 as percentage
    UNION ALL
    SELECT 
      'Police Force' as agency, 
      5 as percentage
  ) as data
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get budget trends
CREATE OR REPLACE FUNCTION get_budget_trends()
RETURNS json[] AS $$
DECLARE
  result json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'name', month,
      'allocated', allocated,
      'spent', spent
    )
  )
  FROM (
    SELECT 
      'Jan' as month, 
      4000 as allocated,
      2400 as spent
    UNION ALL
    SELECT 
      'Feb' as month, 
      3000 as allocated,
      1398 as spent
    UNION ALL
    SELECT 
      'Mar' as month, 
      2000 as allocated,
      9800 as spent
    UNION ALL
    SELECT 
      'Apr' as month, 
      2780 as allocated,
      3908 as spent
    UNION ALL
    SELECT 
      'May' as month, 
      1890 as allocated,
      4800 as spent
    UNION ALL
    SELECT 
      'Jun' as month, 
      2390 as allocated,
      3800 as spent
  ) as data
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get fraud patterns
CREATE OR REPLACE FUNCTION get_fraud_patterns()
RETURNS json[] AS $$
DECLARE
  result json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'name', pattern,
      'count', count
    )
  )
  FROM (
    SELECT 
      'Duplicate Payments' as pattern, 
      24 as count
    UNION ALL
    SELECT 
      'Inflated Contracts' as pattern, 
      18 as count
    UNION ALL
    SELECT 
      'Ghost Projects' as pattern, 
      12 as count
    UNION ALL
    SELECT 
      'Political Connections' as pattern, 
      9 as count
    UNION ALL
    SELECT 
      'Unusual Amounts' as pattern, 
      15 as count
  ) as data
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get fraud trends
CREATE OR REPLACE FUNCTION get_fraud_trends()
RETURNS json[] AS $$
DECLARE
  result json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'name', month,
      'fraudCases', cases,
      'amount', amount
    )
  )
  FROM (
    SELECT 
      'Jan' as month, 
      4 as cases,
      2.4 as amount
    UNION ALL
    SELECT 
      'Feb' as month, 
      3 as cases,
      1.8 as amount
    UNION ALL
    SELECT 
      'Mar' as month, 
      5 as cases,
      3.2 as amount
    UNION ALL
    SELECT 
      'Apr' as month, 
      7 as cases,
      4.5 as amount
    UNION ALL
    SELECT 
      'May' as month, 
      2 as cases,
      1.2 as amount
    UNION ALL
    SELECT 
      'Jun' as month, 
      6 as cases,
      3.8 as amount
    UNION ALL
    SELECT 
      'Jul' as month, 
      8 as cases,
      5.1 as amount
    UNION ALL
    SELECT 
      'Aug' as month, 
      9 as cases,
      6.3 as amount
    UNION ALL
    SELECT 
      'Sep' as month, 
      4 as cases,
      2.7 as amount
  ) as data
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Get recent activity
CREATE OR REPLACE FUNCTION get_recent_activity()
RETURNS json[] AS $$
DECLARE
  result json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'title', title,
      'description', description,
      'date', date,
      'icon', icon,
      'iconBg', iconBg,
      'iconColor', iconColor
    )
  )
  FROM (
    SELECT 
      'Budget Increase Approved' as title, 
      'Additional ₦500M allocated to Cyber Defense' as description,
      'Today, 10:30 AM' as date,
      'dollar' as icon,
      'bg-green-100' as iconBg,
      'text-green-600' as iconColor
    UNION ALL
    SELECT 
      'Potential Duplicate Payment Detected' as title, 
      'AI flagged TR-9823 for review - similar to previous transaction' as description,
      'Yesterday, 3:45 PM' as date,
      'alert' as icon,
      'bg-amber-100' as iconBg,
      'text-amber-600' as iconColor
    UNION ALL
    SELECT 
      'Funds Released' as title, 
      '₦1.2B released to Border Patrol for equipment procurement' as description,
      'Sep 14, 2023' as date,
      'down' as icon,
      'bg-blue-100' as iconBg,
      'text-blue-600' as iconColor
    UNION ALL
    SELECT 
      'Budget Request Submitted' as title, 
      'Emergency Response requested ₦750M for communication upgrades' as description,
      'Sep 12, 2023' as date,
      'up' as icon,
      'bg-purple-100' as iconBg,
      'text-purple-600' as iconColor
  ) as data
  INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;
*/

