package com.platform.educativa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class EducativaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EducativaApplication.class, args);
    }

    @Bean
    CommandLineRunner migrateData(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Para evitar conflictos con la regla estricta (Check Constraint) que crea PostgreSQL para los Enums,
                // la eliminamos antes de intentar migrar los datos. Spring la volverá a crear después con los valores nuevos.
                jdbcTemplate.execute("ALTER TABLE modules DROP CONSTRAINT IF EXISTS modules_module_type_check");
                
                // Actualizar los registros existentes para que coincidan con el nuevo Enum
                jdbcTemplate.execute("UPDATE modules SET module_type = 'VIDEO' WHERE module_type IN ('TUTORIAL', 'INSTALLATION', 'RECHARGE')");
                jdbcTemplate.execute("UPDATE modules SET module_type = 'TEXT' WHERE module_type = 'BENEFITS'");
                jdbcTemplate.execute("UPDATE modules SET module_type = 'DOCUMENT' WHERE module_type = 'DRIVERS'");
                System.out.println("✅ Migración de Tipos de Módulo completada con éxito.");
            } catch (Exception e) {
                System.err.println("❌ Error en la migración de datos: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }
}
