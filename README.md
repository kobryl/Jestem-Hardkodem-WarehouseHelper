# BCM2024 - WarehouseHelper

## Authors

- Konrad Bryłowski
- Aleksander Czerwionka
- Michał Krause
- Oskar Weber

## How to run the application

1. Make sure you have installed all required dependencies ([requirements.txt](https://github.com/kobryl/Jestem-Hardkodem-WarehouseHelper/requirements.txt) file).
2. Run `python manage.py runserver` to start the UI.
3. Run `python manage.py makemigrations` and `python manage.py migrate` to prepare database.
4. Import data from CSV files (following structure from the task) via:
    - http://localhost:8000/import/products/ - for products import
    - http://localhost:8000/import/locations/ - for locations import
    - http://localhost:8000/import/order/ - for each order import
5. You can also add new orders using the UI: http://localhost:8000/new/order/.
6. Each order's route takes some time after submission - wait patiently.
7. TBD

## Used technologies

- django with default SQLite database
- jQuery
- d3js
