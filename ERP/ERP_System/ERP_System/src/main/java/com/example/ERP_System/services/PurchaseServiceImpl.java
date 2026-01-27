package com.example.ERP_System.services;

import com.example.ERP_System.models.PurchaseOrder;
import com.example.ERP_System.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.ERP_System.models.Grn;
import com.example.ERP_System.repository.GrnRepository;
import com.example.ERP_System.repository.ProductRepository;
import com.example.ERP_System.models.OrderStatus;
import org.springframework.transaction.annotation.Transactional;
import com.example.ERP_System.models.PurchaseOrderItem;

import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;
    @Autowired
    private GrnRepository grnRepository;
    @Autowired
    private ProductRepository productRepository;

    @Override
    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder){
        purchaseOrder.setStatus(OrderStatus.ORDERED);
        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders(){
        return purchaseOrderRepository.findAll();
    }

    @Override
    @Transactional
    public PurchaseOrder getPurchaseOrderById(Long id){
        return purchaseOrderRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + id));
    }

    @Override
    @Transactional
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder purchaseOrder){
        PurchaseOrder existingOrder = getPurchaseOrderById(id);
        existingOrder.setOrderDate(purchaseOrder.getOrderDate());
        existingOrder.setSupplier(purchaseOrder.getSupplier());
        existingOrder.setItems(purchaseOrder.getItems());
        existingOrder.setStatus(purchaseOrder.getStatus());
        return purchaseOrderRepository.save(existingOrder);
    }

    @Override
    @Transactional
    public Void deletePurchaseOrder(Long id){
        purchaseOrderRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Grn createGrn(Long poId, String receivedBy){
        PurchaseOrder po = purchaseOrderRepository.findById(poId).orElseThrow(() -> new RuntimeException("Purchase Order not found with id " + poId));

        if (po.getStatus() != OrderStatus.ORDERED) {
            throw new RuntimeException("Cannot receive goods for Purchase Order not in ORDERED status");
        }

        for (PurchaseOrderItem item : po.getItems()){
            Product product = item.getProduct();
            int newStock = product.getCurrentStock() + item.getQuantity();
            product.setCurrentStock(newStock);
            productRepository.save(product);
        }

        po.setStatus(OrderStatus.RECEIVED);
        purchaseOrderRepository.save(po);

        Grn grn = new Grn();
        grn.setPurchaseOrder(po);
        grn.setReceivedBy(receivedBy);
        return grnRepository.save(grn);
    }
}