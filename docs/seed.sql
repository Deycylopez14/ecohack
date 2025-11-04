-- Script para agregar datos de ejemplo en EcoHack
-- Ejecuta DESPUÉS de docs/supabase.sql

-- Insertar retos de ejemplo
INSERT INTO challenges (title, description, points, active) VALUES
('Recicla 5 botellas de plástico', 'Junta y recicla 5 botellas de plástico PET en tu punto más cercano', 50, true),
('Visita un punto de reciclaje', 'Ve a tu punto de reciclaje más cercano y conoce el proceso', 30, true),
('Separa residuos por una semana', 'Mantén la separación correcta de residuos durante 7 días consecutivos', 100, true),
('Comparte en redes sociales', 'Comparte tu progreso eco-amigable con el hashtag #EcoHack', 25, true),
('Completa el quiz educativo', 'Responde correctamente todas las preguntas del módulo educativo', 40, true);

-- Insertar posts de ejemplo para la comunidad
-- Nota: Reemplaza 'user-id-aqui' con un user_id válido de tu tabla auth.users
INSERT INTO posts (user_id, content, likes, created_at) VALUES
('user-id-aqui', '¡Hoy reciclé 20 botellas! 🎉 Cada pequeño gesto cuenta. #EcoReto', 15, DATEADD(HOUR, -3, GETDATE())),
('user-id-aqui', 'Mi familia y yo juntamos todo el plástico de la semana. ¡Un pequeño paso hacia un futuro más verde! ♻️', 8, DATEADD(DAY, -1, GETDATE())),
('user-id-aqui', '¿Sabían que reciclar una lata de aluminio ahorra la energía equivalente a 3 horas de TV? 📺⚡', 22, DATEADD(DAY, -2, GETDATE())),
('user-id-aqui', 'Primer día usando EcoHack y ya aprendí a separar mejor mis residuos. ¡Gracias por la app! 🌱', 12, DATEADD(HOUR, -4, GETDATE())),
('user-id-aqui', 'Reto completado: visité el punto de reciclaje más cercano. El personal es súper amable y me explicaron todo el proceso 👍', 18, DATEADD(HOUR, -6, GETDATE()));

-- Ver datos insertados
SELECT 'Retos creados:' as info, count(*) as total FROM challenges WHERE active = true;
SELECT 'Posts de ejemplo:' as info, count(*) as total FROM posts;