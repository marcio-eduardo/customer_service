package com.faculdade.customer_service_back.dto.dashboard;

public class DashboardStatsDTO {
    private Long totalOpenTickets;
    private Long totalResolvedTickets;
    private Long totalInProgressTickets;
    private Long totalUrgentTickets;
    private Long totalHighPriorityTickets;
    private Long totalMediumPriorityTickets;
    private Long totalLowPriorityTickets;

    public DashboardStatsDTO(Long totalOpenTickets, Long totalResolvedTickets, Long totalInProgressTickets,
                             Long totalUrgentTickets, Long totalHighPriorityTickets, Long totalMediumPriorityTickets, Long totalLowPriorityTickets) {
        this.totalOpenTickets = totalOpenTickets;
        this.totalResolvedTickets = totalResolvedTickets;
        this.totalInProgressTickets = totalInProgressTickets;
        this.totalUrgentTickets = totalUrgentTickets;
        this.totalHighPriorityTickets = totalHighPriorityTickets;
        this.totalMediumPriorityTickets = totalMediumPriorityTickets;
        this.totalLowPriorityTickets = totalLowPriorityTickets;
    }

    // Getters and Setters for status counts
    public Long getTotalOpenTickets() { return totalOpenTickets; }
    public void setTotalOpenTickets(Long totalOpenTickets) { this.totalOpenTickets = totalOpenTickets; }
    public Long getTotalResolvedTickets() { return totalResolvedTickets; }
    public void setTotalResolvedTickets(Long totalResolvedTickets) { this.totalResolvedTickets = totalResolvedTickets; }
    public Long getTotalInProgressTickets() { return totalInProgressTickets; }
    public void setTotalInProgressTickets(Long totalInProgressTickets) { this.totalInProgressTickets = totalInProgressTickets; }

    // Getters and Setters for priority counts
    public Long getTotalUrgentTickets() { return totalUrgentTickets; }
    public void setTotalUrgentTickets(Long totalUrgentTickets) { this.totalUrgentTickets = totalUrgentTickets; }
    public Long getTotalHighPriorityTickets() { return totalHighPriorityTickets; }
    public void setTotalHighPriorityTickets(Long totalHighPriorityTickets) { this.totalHighPriorityTickets = totalHighPriorityTickets; }
    public Long getTotalMediumPriorityTickets() { return totalMediumPriorityTickets; }
    public void setTotalMediumPriorityTickets(Long totalMediumPriorityTickets) { this.totalMediumPriorityTickets = totalMediumPriorityTickets; }
    public Long getTotalLowPriorityTickets() { return totalLowPriorityTickets; }
    public void setTotalLowPriorityTickets(Long totalLowPriorityTickets) { this.totalLowPriorityTickets = totalLowPriorityTickets; }
}
