"""make latitude and longitude nullable in infrastructure_issues
Revision ID: 0158f9e75364
Revises: b34bcae9fbad
Create Date: 2025-09-08 21:15:11.792295
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
# revision identifiers, used by Alembic.
revision: str = '0158f9e75364'
down_revision: Union[str, Sequence[str], None] = 'b34bcae9fbad'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None
def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column('infrastructure_issues', 'latitude',
               existing_type=sa.NUMERIC(precision=10, scale=8),
               nullable=True)
    op.alter_column('infrastructure_issues', 'longitude',
               existing_type=sa.NUMERIC(precision=11, scale=8),
               nullable=True)
def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column('infrastructure_issues', 'longitude',
               existing_type=sa.NUMERIC(precision=11, scale=8),
               nullable=False)
    op.alter_column('infrastructure_issues', 'latitude',
               existing_type=sa.NUMERIC(precision=10, scale=8),
               nullable=False)