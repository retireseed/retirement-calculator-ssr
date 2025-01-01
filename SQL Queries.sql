select avg(current_age),min(current_age),max(current_age) from calculations where id > 1696;

SELECT COUNT(DISTINCT IP_ADDRESS) FROM calculations WHERE ID>1696;

SELECT ip_address,COUNT( IP_ADDRESS) FROM calculations WHERE ID>1696 group by ip_address order by count(ip_address) desc; 

select * from calculations where ip_address='71.232.223.113';

delete from income where ip_address='86.158.147.232'