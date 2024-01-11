# BCM2024 - WarehouseHelper

## Authors

- Konrad Bryłowski
- Aleksander Czerwionka
- Michał Krause
- Oskar Weber

## How to run the application

1. Make sure you have installed all required dependencies ([requirements.txt](https://github.com/kobryl/Jestem-Hardkodem-WarehouseHelper/requirements.txt) file).
2. To start the UI run:
    ```
    python manage.py runserver
    ```
3. To prepare the database run: 
    ```
    python manage.py makemigrations
    python manage.py migrate
    ```
4. Import data from CSV files (following structure from the task) via:
    - http://localhost:8000/import/products/ - for products import
    - http://localhost:8000/import/locations/ - for locations import
    - http://localhost:8000/import/order/ - for each order import

    Alternatively you can import all data at once - put your products and locations in the files specified in `consts.py` as `PRODUCTS_FILE` and `LOCATIONS_FILE` (default: `data/ListaProduktow.csv` for products and `data/LokacjeProduktow` for locations). For orders you also need to follow (or change) the `consts.py` constants - default setting for order files is `data/Zamowienia/Zamowienie1.csv` for order with id 1.

    Then you need to run the python shell in application context:
    ```
    python manage.py shell
    ```
    and in the shell:
    ```
    import load_data
    ```


5. You can also add new orders using the UI: http://localhost:8000/new/order/.
6. Each order's route takes some time after submission - wait patiently.
7. TBD

## Used technologies

- django with default SQLite database
- jQuery
- d3js
