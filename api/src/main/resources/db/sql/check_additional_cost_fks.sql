-- Connect using your local credentials or SQL client. DO NOT commit real passwords.
-- Example: CONNECT ATLAS_CMMS_DEV/<PASSWORD>@<SERVICE>
SET PAGESIZE 200
SET LINESIZE 200
SET ECHO OFF
SELECT uc.constraint_name,
       uc.delete_rule,
       uc_pk.table_name AS referenced_table
FROM user_constraints uc
LEFT JOIN user_constraints uc_pk ON uc.r_constraint_name = uc_pk.constraint_name
WHERE uc.table_name = 'ADDITIONAL_COST'
  AND uc.constraint_type = 'R';

EXIT
