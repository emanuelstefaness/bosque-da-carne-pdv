-- Itens só para PDV interno (não expostos em /api/public/menu)
ALTER TABLE items ADD COLUMN IF NOT EXISTS internal_only INTEGER DEFAULT 0;
