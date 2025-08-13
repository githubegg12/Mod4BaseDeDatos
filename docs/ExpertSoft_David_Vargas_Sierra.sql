create database ExpertSoft_David_Vargas_Sierra;

use ExpertSoft_David_Vargas_Sierra;

create table if not exists clients(
id_client int primary key auto_increment,
client_name varchar(255) not null,
client_identification varchar(255) not null unique,
address varchar(255) not null,
cellphone varchar(30) not null unique,
email varchar(100) not null unique,

created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists invoices (
invoice_number varchar(255) primary key,
invoice_period varchar(15) not null,
invoice_amount int not null,
amount_paid int,
id_client int,

created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,

foreign key (id_client) references clients(id_client)
on delete set null
on update cascade
);


create table if not exists platforms(
id_platform int primary key auto_increment,
platform_name varchar(255) not null unique,

created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists transactions (
id_transaction varchar(255) primary key unique,
transaction_date datetime not null,
transaction_amount int not null,
transaction_state enum('Pendiente','Completada','Fallida') not null    , 
transaction_type enum('Pago de Factura') not null,
invoice_number varchar (255),
id_platform int,

created_at timestamp default current_timestamp,
updated_at timestamp default current_timestamp on update current_timestamp,

foreign key (invoice_number) references invoices(invoice_number)
on delete set null
on update cascade,

foreign key (id_platform) references platforms(id_platform)
on delete set null
on update cascade
);	

select * from clients;
select * from platforms;
select * from invoices;
select * from transactions;

select clients.id_client,
clients.client_name,
clients.client_identification,
invoices.invoice_number,
invoices.amount_paid,
transactions.id_transaction,
transactions.transaction_state
from clients join invoices on clients.id_client =invoices.id_client
join transactions on transactions.invoice_number=invoices.invoice_number
join platforms on transactions.id_platform = platforms.id_platform where clients.id_client = '1';

   SELECT clients.client_name,
   clients.cellphone,
   clients.address,
   transactions.id_transaction,
transactions.transaction_state
FROM clients JOIN invoices on clients.id_client = invoices.id_client
join transactions on transactions.invoice_number=invoices.invoice_number;

SELECT 
clients.id_client,
clients.client_name,
transactions.invoice_number,
invoices.amount_paid,
transactions.id_transaction,
platforms.platform_name
from clients join invoices on clients.id_client =invoices.id_client
join transactions on transactions.invoice_number=invoices.invoice_number
join platforms on transactions.id_platform = platforms.id_platform
WHERE platforms.platform_name= 'Nequi';
