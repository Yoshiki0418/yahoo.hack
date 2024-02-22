"""empty message

Revision ID: 17dcc88b068c
Revises: a7eb8bd362e5
Create Date: 2024-02-22 20:37:03.506302

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '17dcc88b068c'
down_revision = 'a7eb8bd362e5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('post_style_link')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('post_style_link',
    sa.Column('post_id', sa.INTEGER(), nullable=False),
    sa.Column('style_id', sa.VARCHAR(length=50), nullable=False),
    sa.ForeignKeyConstraint(['post_id'], ['post.id'], name='fk_post_style_post_id'),
    sa.ForeignKeyConstraint(['style_id'], ['style.id'], name='fk_post_style_style_id'),
    sa.PrimaryKeyConstraint('post_id', 'style_id')
    )
    # ### end Alembic commands ###