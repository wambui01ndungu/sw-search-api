from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

from app import app, db


config = context.config

fileConfig(config.config_file_name)

# Set target metadata for 'autogenerate' support
target_metadata = db.metadata

def run_migrations_online():
    connectable = db.engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            )


        with context.begin_transaction():
                context.run_migrations()

if context.is_offline_mode():
    
    pass
else:
  with app.app_context():
    run_migrations_online()
