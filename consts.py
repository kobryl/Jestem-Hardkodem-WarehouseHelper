from pathlib import Path
# Data loading settings

DATA_DIR = Path(__file__).resolve().parent / 'data'
PRODUCTS_FILE = DATA_DIR / 'ListaProduktow.csv'
LOCATIONS_FILE = DATA_DIR / 'LokacjeProduktow.csv'
ORDERS_DIR = DATA_DIR / 'Zamowienia'
ORDER_FILE_PREFIX = 'Zamowienie'
ORDER_COUNT = 20

DEFAULT_PRIORITY = 'WEIGHT'
