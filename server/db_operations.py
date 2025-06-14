import mysql.connector
from helper import helper
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class db_operations():
    # constructor with connection path to DB
    def __init__(self, conn_path):
        self.connection = mysql.connector.connect(host=conn_path,
        user="root",
        password=os.getenv("PASSWORD"),
        auth_plugin='mysql_native_password',
        database="HealthPortal")
        self.cursor = self.connection.cursor()
        print("connection made..")


    # function to simply execute a DDL or DML query.
    # commits query, returns no results.
    # best used for insert/update/delete queries with no parameters
    def modify_query(self, query):
        self.cursor.execute(query)
        self.connection.commit()


    # function to simply execute a DDL or DML query with parameters
    # commits query, returns no results.
    # best used for insert/update/delete queries with named placeholders
    def modify_query_params(self, query, params):
        self.cursor.execute(query, params)  # positional placeholders
        self.connection.commit()


    # function to simply execute a DQL query
    # does not commit, returns results
    # best used for select queries with no parameters
    def select_query(self, query):
        self.cursor.execute(query)  # Execute the query
        return self.cursor.fetchall()  # Fetch and return all results

   
    # function to simply execute a DQL query with parameters
    # does not commit, returns results
    # best used for select queries with named placeholders
    def select_query_params(self, query, dictionary):
        self.cursor.execute(query, dictionary)
        return self.cursor.fetchall()


    # function to return the value of the first row's
    # first attribute of some select query.
    # best used for querying a single aggregate select
    # query with no parameters
    def single_record(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchone()[0]
   
    # function to return the value of the first row's
    # first attribute of some select query.
    # best used for querying a single aggregate select
    # query with named placeholders
    def single_record_params(self, query, dictionary):
        self.cursor.execute(query, dictionary)
        return self.cursor.fetchone()[0]
   
    # function to return a single attribute for all records
    # from some table.
    # best used for select statements with no parameters
    def single_attribute(self, query):
        self.cursor.execute(query)
        results = self.cursor.fetchall()
        results = [i[0] for i in results]
        results.remove(None)
        return results
   
    # function to return a single attribute for all records
    # from some table.
    # best used for select statements with named placeholders
    def single_attribute_params(self, query, dictionary):
        self.cursor.execute(query,dictionary)
        results = self.cursor.fetchall()
        results = [i[0] for i in results]
        return results
   
    # function for bulk inserting records
    # best used for inserting many records with parameters
    def bulk_insert(self, query, data):
        self.cursor.executemany(query, data)
        self.connection.commit()
   
    # function that creates patient table in our database
    def create_patient_table(self):
        query = '''
        CREATE TABLE patient(
            patient_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20),
            password VARCHAR(20),
            dob DATE,
            gender CHAR(1),
            phone VARCHAR(20)
        );
        '''
        self.cursor.execute(query)
        print('patient table created')


    # function that creates appointment table in our database
    def create_appointment_table(self):
        query = '''
        CREATE TABLE appointment(
            appointment_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            date DATE,
            time TIME,
            status VARCHAR(20),
            reason VARCHAR(20),
            patient_id INT,
            doctor_id INT,
            FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
            FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
        );
        '''
        self.cursor.execute(query)
        print('appointment table created')


    # function that creates diagnosis table in our database
    def create_diagnosis_table(self):
        query = '''
        CREATE TABLE diagnosis(
            diagnosis_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            diagnosis VARCHAR(20),
            treatment VARCHAR(20)
        );
        '''
        self.cursor.execute(query)
        print('diagnosis table created')


    # function that creates record table in our database
    def create_record_table(self):
        query = '''
        CREATE TABLE record(
            record_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            notes VARCHAR(30),
            treatment VARCHAR(30),
            date DATE,
            diagnosis_id INT,
            patient_id INT,
            FOREIGN KEY (diagnosis_id) REFERENCES diagnosis(diagnosis_id),
            FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
        );
        '''
        self.cursor.execute(query)
        print('record table created')


    # function that creates doctor table in our database
    def create_doctor_table(self):
        query = '''
        CREATE TABLE doctor(
            doctor_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20)
        );
        '''
        self.cursor.execute(query)
        print('doctor table created')

    # function that creates doctor-record joined table in our database
    def create_doctor_record_table(self):
        query = '''
        CREATE TABLE doctor_record(
            doctor_id INT,
            record_id INT,
            FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
            FOREIGN KEY (record_id) REFERENCES record(record_id),
            PRIMARY KEY (doctor_id, record_id)
        );
        '''
        self.cursor.execute(query)
        print('doctor_record table created')


    # function that creates test table in our database
    def create_test_table(self):
        query = '''
        CREATE TABLE test(
            test_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            test_name VARCHAR(20),
            normal_range VARCHAR(20)
        );
        '''
        self.cursor.execute(query)
        print('test table created')


    # function that creates lab table in our database
    def create_lab_table(self):
        query = '''
        CREATE TABLE lab(
            lab_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            result VARCHAR(20),
            date DATE,
            test_id INT,
            patient_id INT,
            doctor_id INT,
            FOREIGN KEY (test_id) REFERENCES test(test_id),
            FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
            FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
        );
        '''
        self.cursor.execute(query)
        print('lab table created')


    # function that creates message table in our database
    def create_message_table(self):
        query = '''
        CREATE TABLE message(
            message_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
            message_body VARCHAR(50),
            timestamp TIMESTAMP,
            patient_id INT,
            doctor_id INT,
            sender_id INT,
            FOREIGN KEY (patient_id) REFERENCES patient(patient_id),
            FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id)
        );
        '''
        self.cursor.execute(query)
        print('message table created')


    # function that returns if table has records
    def is_table_empty(self, table):
        #query to get count of records in table
        query = f'''
        SELECT COUNT(*)
        FROM {table};
        '''
        #run query and return value
        result = self.single_record(query)
        return result == 0

    def drop_table(self, table):
        query = f"DROP TABLE IF EXISTS {table};"
        self.cursor.execute(query)
        print(f"{table} table dropped")


    # function to populate tables given some path
    # to a CSV containing records
    def populate_table(self, filepath, table):
        if self.is_table_empty(table):
            data = helper.data_cleaner(filepath)
            attribute_count = len(data[0])
           
            placeholders = ("%s," * attribute_count)[:-1]
            # Insert ignore for duplicates
            query = f"INSERT IGNORE INTO {table} VALUES({placeholders})"
            self.bulk_insert(query, data)


    # destructor that closes connection with DB
    def destructor(self):
        self.cursor.close()
        self.connection.close()

