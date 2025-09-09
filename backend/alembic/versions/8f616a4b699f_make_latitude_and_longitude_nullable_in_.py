"""Make latitude and longitude nullable in InfrastructureIssue

Revision ID: 8f616a4b699f
Revises: 0158f9e75364
Create Date: 2025-09-09 07:23:17.903474

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '8f616a4b699f'
down_revision: Union[str, Sequence[str], None] = '0158f9e75364'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass