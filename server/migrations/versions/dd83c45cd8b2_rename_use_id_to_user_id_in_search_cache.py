"""Rename use_id to user_id in search_cache

Revision ID: dd83c45cd8b2
Revises: b3f001c247d4
Create Date: 2025-06-18 08:27:20.372808

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dd83c45cd8b2'
down_revision = 'b3f001c247d4'
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
   pass
   
