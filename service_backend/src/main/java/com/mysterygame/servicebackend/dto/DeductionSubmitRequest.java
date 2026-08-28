package com.mysterygame.servicebackend.dto;

import lombok.Data;
import java.util.List;

@Data
public class DeductionSubmitRequest {
    private String culpritId;
    private String motive;
    private String narrative;
    private List<String> selectedEvidenceIds;
    private long timeTakenSeconds;
}
