package com.platform.educativa.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.platform.educativa.model.entity.Certificate;
import com.platform.educativa.model.entity.Course;
import com.platform.educativa.model.entity.User;
import com.platform.educativa.repository.CertificateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final CertificateRepository certificateRepository;

    public Certificate generateCertificate(User user, Course course) {
        // Verificar si ya existe para evitar duplicados
        if (certificateRepository.existsByUserIdAndCourseId(user.getId(), course.getId())) {
            return certificateRepository.findByUserId(user.getId()).stream()
                    .filter(c -> c.getCourse().getId().equals(course.getId()))
                    .findFirst()
                    .orElseThrow();
        }

        try {
            // Generar archivo PDF localmente
            String fileName = UUID.randomUUID().toString() + "_certificate.pdf";
            Path path = Paths.get("uploads", fileName).toAbsolutePath().normalize();
            File file = path.toFile();
            
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(file));
            
            document.open();
            
            // --- DISEÑO PREMIUM DEL CERTIFICADO ---
            
            // 1. Colores
            BaseColor darkBlue = new BaseColor(25, 42, 86);
            BaseColor gold = new BaseColor(212, 175, 55);
            BaseColor lightGrey = new BaseColor(100, 100, 100);
            
            // 2. Bordes
            com.itextpdf.text.pdf.PdfContentByte canvas = writer.getDirectContent();
            Rectangle rect = document.getPageSize();
            
            // Borde exterior grueso (Azul Oscuro)
            canvas.setColorStroke(darkBlue);
            canvas.setLineWidth(15f);
            canvas.rectangle(rect.getLeft() + 30, rect.getBottom() + 30, rect.getWidth() - 60, rect.getHeight() - 60);
            canvas.stroke();
            
            // Borde interior fino (Dorado)
            canvas.setColorStroke(gold);
            canvas.setLineWidth(3f);
            canvas.rectangle(rect.getLeft() + 48, rect.getBottom() + 48, rect.getWidth() - 96, rect.getHeight() - 96);
            canvas.stroke();
            
            // 3. Fuentes
            Font titleFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 46, darkBlue);
            Font subtitleFont = FontFactory.getFont(FontFactory.TIMES_ITALIC, 20, lightGrey);
            Font nameFont = FontFactory.getFont(FontFactory.TIMES_BOLD, 40, gold);
            Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 16, BaseColor.DARK_GRAY);
            Font courseFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, darkBlue);
            Font smallFont = FontFactory.getFont(FontFactory.HELVETICA, 12, lightGrey);
            
            document.add(new Paragraph("\n\n")); // Espaciado inicial
            
            Paragraph title = new Paragraph("CERTIFICADO DE EXCELENCIA", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(30);
            document.add(title);
            
            Paragraph p1 = new Paragraph("Este diploma se otorga con orgullo a:", subtitleFont);
            p1.setAlignment(Element.ALIGN_CENTER);
            p1.setSpacingAfter(25);
            document.add(p1);
            
            String fullName = user.getFullName() != null ? user.getFullName().toUpperCase() : "ESTUDIANTE DESTACADO";
            Paragraph name = new Paragraph(fullName, nameFont);
            name.setAlignment(Element.ALIGN_CENTER);
            name.setSpacingAfter(35);
            document.add(name);
            
            Paragraph p2 = new Paragraph("Por haber completado satisfactoriamente todos los requisitos académicos del programa:", textFont);
            p2.setAlignment(Element.ALIGN_CENTER);
            p2.setSpacingAfter(20);
            document.add(p2);
            
            Paragraph courseTitle = new Paragraph(course.getTitle().toUpperCase(), courseFont);
            courseTitle.setAlignment(Element.ALIGN_CENTER);
            courseTitle.setSpacingAfter(60);
            document.add(courseTitle);
            
            // Footer: Fecha y Firma
            com.itextpdf.text.pdf.PdfPTable table = new com.itextpdf.text.pdf.PdfPTable(2);
            table.setWidthPercentage(80);
            
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd 'de' MMMM 'de' yyyy");
            Paragraph dateText = new Paragraph("Emitido el: " + LocalDateTime.now().format(dtf), textFont);
            dateText.setAlignment(Element.ALIGN_CENTER);
            
            com.itextpdf.text.pdf.PdfPCell cell1 = new com.itextpdf.text.pdf.PdfPCell(dateText);
            cell1.setBorder(Rectangle.NO_BORDER);
            cell1.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            Paragraph signature = new Paragraph("___________________________\nDirector del Programa", textFont);
            signature.setAlignment(Element.ALIGN_CENTER);
            
            com.itextpdf.text.pdf.PdfPCell cell2 = new com.itextpdf.text.pdf.PdfPCell(signature);
            cell2.setBorder(Rectangle.NO_BORDER);
            cell2.setHorizontalAlignment(Element.ALIGN_CENTER);
            
            table.addCell(cell1);
            table.addCell(cell2);
            document.add(table);
            
            document.close();

            // Guardar en la base de datos
            Certificate certificate = Certificate.builder()
                    .user(user)
                    .course(course)
                    .pdfUrl("/api/files/download/" + fileName)
                    .issuedAt(LocalDateTime.now())
                    .build();

            return certificateRepository.save(certificate);

        } catch (Exception e) {
            throw new RuntimeException("Error al generar el certificado PDF", e);
        }
    }
}
