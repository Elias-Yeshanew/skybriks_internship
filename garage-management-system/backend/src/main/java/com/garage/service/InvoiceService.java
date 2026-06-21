package com.garage.service;

import com.garage.dto.InvoiceRequest;
import com.garage.dto.InvoiceResponse;
import com.garage.entity.Customer;
import com.garage.entity.Invoice;
import com.garage.entity.ServiceRequest;
import com.garage.entity.Vehicle;
import com.garage.exception.ResourceConflictException;
import com.garage.exception.ResourceNotFoundException;
import com.garage.repository.InvoiceRepository;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final ServiceRequestService serviceRequestService;

    @Value("${app.upload.dir:./uploads/invoices}")
    private String uploadDir;

    private static final double TAX_RATE = 0.15; // 15% VAT

    public List<InvoiceResponse> getAll() {
        return invoiceRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public InvoiceResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    public List<InvoiceResponse> getByCustomer(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId).stream()
            .map(this::toResponse).collect(Collectors.toList());
    }

    public InvoiceResponse generate(InvoiceRequest req) {
        if (invoiceRepository.existsByServiceRequestId(req.getServiceRequestId()))
            throw new ResourceConflictException("Invoice already exists for this service request");

        ServiceRequest sr = serviceRequestService.findOrThrow(req.getServiceRequestId());
        Customer customer = sr.getVehicle().getCustomer();

        BigDecimal laborCost = req.getLaborCost() != null ? req.getLaborCost() : BigDecimal.ZERO;
        BigDecimal partsCost = req.getPartsCost() != null ? req.getPartsCost() : BigDecimal.ZERO;
        BigDecimal subtotal = laborCost.add(partsCost);
        BigDecimal taxAmount = subtotal.multiply(BigDecimal.valueOf(TAX_RATE));
        BigDecimal total = subtotal.add(taxAmount);

        String invoiceNumber = "INV-" + System.currentTimeMillis();

        Invoice invoice = Invoice.builder()
            .invoiceNumber(invoiceNumber)
            .serviceRequest(sr)
            .customer(customer)
            .laborCost(laborCost)
            .partsCost(partsCost)
            .taxAmount(taxAmount)
            .totalAmount(total)
            .issueDate(LocalDate.now())
            .dueDate(LocalDate.now().plusDays(30))
            .notes(req.getNotes())
            .status(Invoice.InvoiceStatus.UNPAID)
            .build();

        invoice = invoiceRepository.save(invoice);

        // Generate PDF
        try {
            String pdfPath = generatePdf(invoice);
            invoice.setPdfPath(pdfPath);
            invoice = invoiceRepository.save(invoice);
        } catch (Exception e) {
            // PDF generation failure should not block invoice creation
        }

        return toResponse(invoice);
    }

    public InvoiceResponse markAsPaid(Long id) {
        Invoice invoice = findOrThrow(id);
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        return toResponse(invoiceRepository.save(invoice));
    }

    private String generatePdf(Invoice invoice) throws DocumentException, IOException {
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        String filename = invoice.getInvoiceNumber() + ".pdf";
        String filePath = dir.resolve(filename).toString();

        Document document = new Document(PageSize.A4, 36, 36, 54, 36);
        PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();

        // Fonts
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 22, Font.BOLD, BaseColor.DARK_GRAY);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 11, Font.BOLD, BaseColor.WHITE);
        Font bodyFont = new Font(Font.FontFamily.HELVETICA, 10);
        Font boldFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD);

        Customer customer = invoice.getCustomer();
        ServiceRequest sr = invoice.getServiceRequest();
        Vehicle vehicle = sr.getVehicle();

        // Title
        Paragraph title = new Paragraph("GARAGE MANAGEMENT SYSTEM", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        Paragraph subtitle = new Paragraph("TAX INVOICE", new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, new BaseColor(80, 80, 80)));
        subtitle.setAlignment(Element.ALIGN_CENTER);
        subtitle.setSpacingAfter(10);
        document.add(subtitle);

        // Invoice meta table
        PdfPTable metaTable = new PdfPTable(2);
        metaTable.setWidthPercentage(100);
        metaTable.setSpacingAfter(15);

        addMetaCell(metaTable, "Invoice Number:", invoice.getInvoiceNumber(), boldFont, bodyFont);
        addMetaCell(metaTable, "Issue Date:", invoice.getIssueDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), boldFont, bodyFont);
        addMetaCell(metaTable, "Due Date:", invoice.getDueDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")), boldFont, bodyFont);
        addMetaCell(metaTable, "Status:", invoice.getStatus().name(), boldFont, bodyFont);
        document.add(metaTable);

        // Customer & Vehicle info
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        infoTable.setSpacingAfter(15);

        PdfPCell billToCell = new PdfPCell();
        billToCell.setBorder(Rectangle.BOX);
        billToCell.setPadding(8);
        billToCell.addElement(new Paragraph("BILL TO", boldFont));
        billToCell.addElement(new Paragraph(customer.getFirstName() + " " + customer.getLastName(), bodyFont));
        billToCell.addElement(new Paragraph("Phone: " + customer.getPhone(), bodyFont));
        if (customer.getEmail() != null)
            billToCell.addElement(new Paragraph("Email: " + customer.getEmail(), bodyFont));
        if (customer.getAddress() != null)
            billToCell.addElement(new Paragraph(customer.getAddress(), bodyFont));

        PdfPCell vehicleCell = new PdfPCell();
        vehicleCell.setBorder(Rectangle.BOX);
        vehicleCell.setPadding(8);
        vehicleCell.addElement(new Paragraph("VEHICLE DETAILS", boldFont));
        vehicleCell.addElement(new Paragraph(vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel(), bodyFont));
        vehicleCell.addElement(new Paragraph("License Plate: " + vehicle.getLicensePlate(), bodyFont));
        if (vehicle.getVinNumber() != null)
            vehicleCell.addElement(new Paragraph("VIN: " + vehicle.getVinNumber(), bodyFont));

        infoTable.addCell(billToCell);
        infoTable.addCell(vehicleCell);
        document.add(infoTable);

        // Line items table
        PdfPTable itemsTable = new PdfPTable(new float[]{5, 2});
        itemsTable.setWidthPercentage(100);
        itemsTable.setSpacingAfter(5);

        // Header row
        BaseColor headerBg = new BaseColor(50, 50, 50);
        PdfPCell descHeader = new PdfPCell(new Phrase("DESCRIPTION", headerFont));
        descHeader.setBackgroundColor(headerBg);
        descHeader.setPadding(8);

        PdfPCell amtHeader = new PdfPCell(new Phrase("AMOUNT (ETB)", headerFont));
        amtHeader.setBackgroundColor(headerBg);
        amtHeader.setPadding(8);
        amtHeader.setHorizontalAlignment(Element.ALIGN_RIGHT);

        itemsTable.addCell(descHeader);
        itemsTable.addCell(amtHeader);

        // Service description
        addLineItem(itemsTable, sr.getDescription(), null, bodyFont);

        // Labor
        if (invoice.getLaborCost().compareTo(BigDecimal.ZERO) > 0)
            addLineItem(itemsTable, "Labor", invoice.getLaborCost(), bodyFont);

        // Parts
        if (invoice.getPartsCost().compareTo(BigDecimal.ZERO) > 0)
            addLineItem(itemsTable, "Parts & Materials", invoice.getPartsCost(), bodyFont);

        document.add(itemsTable);

        // Totals
        PdfPTable totalsTable = new PdfPTable(new float[]{5, 2});
        totalsTable.setWidthPercentage(100);
        totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        BigDecimal subtotal = invoice.getLaborCost().add(invoice.getPartsCost());
        addTotalRow(totalsTable, "Subtotal", subtotal, bodyFont, boldFont, false);
        addTotalRow(totalsTable, "VAT (15%)", invoice.getTaxAmount(), bodyFont, boldFont, false);
        addTotalRow(totalsTable, "TOTAL", invoice.getTotalAmount(), bodyFont, boldFont, true);
        document.add(totalsTable);

        // Notes
        if (invoice.getNotes() != null && !invoice.getNotes().isEmpty()) {
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Notes: " + invoice.getNotes(), bodyFont));
        }

        // Footer
        document.add(new Paragraph(" "));
        Paragraph footer = new Paragraph("Thank you for your business!", new Font(Font.FontFamily.HELVETICA, 10, Font.ITALIC, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return filePath;
    }

    private void addMetaCell(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(3);
        Phrase phrase = new Phrase();
        phrase.add(new Chunk(label + " ", labelFont));
        phrase.add(new Chunk(value, valueFont));
        cell.addElement(new Paragraph(phrase));
        table.addCell(cell);
    }

    private void addLineItem(PdfPTable table, String desc, BigDecimal amount, Font font) {
        PdfPCell descCell = new PdfPCell(new Phrase(desc, font));
        descCell.setPadding(6);
        table.addCell(descCell);

        PdfPCell amtCell = new PdfPCell(new Phrase(amount != null ? String.format("%.2f", amount) : "-", font));
        amtCell.setPadding(6);
        amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(amtCell);
    }

    private void addTotalRow(PdfPTable table, String label, BigDecimal amount, Font bodyFont, Font boldFont, boolean isTotal) {
        Font f = isTotal ? boldFont : bodyFont;
        BaseColor bg = isTotal ? new BaseColor(230, 230, 230) : BaseColor.WHITE;

        PdfPCell labelCell = new PdfPCell(new Phrase(label, f));
        labelCell.setBackgroundColor(bg);
        labelCell.setPadding(6);
        labelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        PdfPCell amtCell = new PdfPCell(new Phrase(String.format("%.2f", amount), f));
        amtCell.setBackgroundColor(bg);
        amtCell.setPadding(6);
        amtCell.setHorizontalAlignment(Element.ALIGN_RIGHT);

        table.addCell(labelCell);
        table.addCell(amtCell);
    }

    public Invoice findOrThrow(Long id) {
        return invoiceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Invoice", id));
    }

    private InvoiceResponse toResponse(Invoice i) {
        ServiceRequest sr = i.getServiceRequest();
        Vehicle vehicle = sr != null ? sr.getVehicle() : null;

        return InvoiceResponse.builder()
            .id(i.getId())
            .invoiceNumber(i.getInvoiceNumber())
            .serviceRequestId(sr != null ? sr.getId() : null)
            .serviceDescription(sr != null ? sr.getDescription() : null)
            .customerId(i.getCustomer() != null ? i.getCustomer().getId() : null)
            .customerName(i.getCustomer() != null
                ? i.getCustomer().getFirstName() + " " + i.getCustomer().getLastName() : null)
            .customerPhone(i.getCustomer() != null ? i.getCustomer().getPhone() : null)
            .vehicleInfo(vehicle != null
                ? vehicle.getYear() + " " + vehicle.getMake() + " " + vehicle.getModel()
                  + " (" + vehicle.getLicensePlate() + ")" : null)
            .laborCost(i.getLaborCost())
            .partsCost(i.getPartsCost())
            .taxAmount(i.getTaxAmount())
            .totalAmount(i.getTotalAmount())
            .issueDate(i.getIssueDate())
            .dueDate(i.getDueDate())
            .status(i.getStatus().name())
            .notes(i.getNotes())
            .createdAt(i.getCreatedAt())
            .build();
    }
}
