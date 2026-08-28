package com.mysterygame.servicebackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseSolution {
    private String culpritId;
    private String culpritName;
    private String motive;
    private String trueSequenceOfEvents;
    
    @Builder.Default
    private List<String> crucialClueIds = new ArrayList<>();
    
    private String confessionSnippet;
}
