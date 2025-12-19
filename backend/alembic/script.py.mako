"""Generic Alembic migration template.
This file is placed here so `alembic revision --autogenerate` can
find the template when generating new revisions.
"""
<%!
from alembic import util
import datetime
%>
"""
Revision ID: ${up_revision}
Revises: ${down_revision | comma,n}
Create Date: ${create_date}
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = ${repr(up_revision)}
down_revision = ${repr(down_revision) if down_revision else None}
branch_labels = ${repr(branch_labels) if branch_labels else None}
depends_on = ${repr(depends_on) if depends_on else None}


def upgrade():
    ${upgrades if upgrades else "pass"}


def downgrade():
    ${downgrades if downgrades else "pass"}
