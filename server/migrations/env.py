from __future__ import with_statement
import logging
from logging.config import fileConfig

from alembic import context
from sqlalchemy import engine_from_config, pool

# Alembic Config
config = context.config

# Logging
fileConfig(config.config_file_name)
logger = logging.getLogger('alembic.env')

# Import create_app and db
from app import create_app, db

# Create Flask app instance using factory
app = create_app()

# Set target metadata for migrations
target_metadata = db.Model.metadata


def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = app.config.get("SQLALCHEMY_DATABASE_URI")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode."""
    connectable = db.engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()


# MAIN LOGIC
if context.is_offline_mode():
    run_migrations_offline()
else:
    with app.app_context():
        run_migrations_online()
