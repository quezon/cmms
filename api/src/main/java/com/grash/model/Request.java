package com.grash.model;

import com.grash.model.abstracts.WorkOrderBase;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
public class Request extends WorkOrderBase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private boolean cancelled;

    private String cancellationReason;

    @OneToOne
    private File audioDescription;

    @OneToOne
    private WorkOrder workOrder;

    @PreRemove
    private void preRemove() {
        if (workOrder != null)
            workOrder.setParentRequest(null);
    }

}
