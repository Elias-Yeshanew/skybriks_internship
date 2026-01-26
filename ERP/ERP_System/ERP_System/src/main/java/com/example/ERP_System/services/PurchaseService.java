package com.example.ERP_System.services;
import com.example.ERP_System.models.PurchaseOrder;
import com.example.ERP_System.models.Grn;
import java.util.List;

public interface PurchaseService {
    PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder);
    // Grn receiveGoods(Long purchaseOrderId, Grn grnDetails);
    List<PurchaseOrder> getAllPurchaseOrders();
    PurchaseOrder getPurchaseOrderById(Long id);
    PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder);
    Void deletePurchaseOrder(Long id);
    Grn createGrn(Long poId, String receivedBy);
}
