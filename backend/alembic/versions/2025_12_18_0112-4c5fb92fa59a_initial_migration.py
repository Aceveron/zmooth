"""Generic Alembic migration template.
This file is placed here so `alembic revision --autogenerate` can
find the template when generating new revisions.
"""

"""
Revision ID: 4c5fb92fa59a
Revises: 
Create Date: 2025-12-18 01:12:35.018464+00:00
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '4c5fb92fa59a'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
