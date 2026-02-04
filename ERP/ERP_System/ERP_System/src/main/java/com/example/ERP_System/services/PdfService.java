package com.example.ERP_System.services;

import com.example.ERP_System.models.SalesOrder;
import com.example.ERP_System.models.SalesOrderItem;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class PdfService {

    public void generateInvoice(HttpServletResponse response, SalesOrder order) throws IOException {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document,response.getOutputStream());

        document.open();

        Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);

        Paragraph title = new Paragraph("INVOICE", fontTitle);
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph("Order ID: #SO-"+ order.getId()));
        document.add(new Paragraph("Customer: " +  order.getCustomer().getName()));
        document.add(new Paragraph("Date: " + order.getOrderDate().toString()));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.addCell("Product");
        table.addCell("Qty");
        table.addCell("Unit Price");
        table.addCell("Subtotal");

        for (SalesOrderItem item : order.getItems()) {
            table.addCell(item.getProduct().getName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell("$" + item.getUnitPrice());
            table.addCell("$" + (item.getQuantity() * item.getUnitPrice()));
        }

        document.add(table);
        document.add(new Paragraph(" "));
        document.add(new Paragraph("Total Amount: $" + order.getTotalAmount(), fontTitle));

        document.close();
    }
}
