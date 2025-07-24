import express from "express";
import { PrismaClient } from "@prisma/client";
import authmiddle from './authmiddleware.js';

const prisma = new PrismaClient();
const router = express.Router();

// Use auth middleware for all analytics routes
router.use(authmiddle);

// Get comprehensive owner dashboard analytics
router.get("/dashboard", async (req, res) => {
  try {
    const userId = req.userId;
    console.log("Dashboard analytics requested for userId:", userId);
    
    // Get owner data
    const owner = await prisma.owner.findUnique({
      where: { userId },
      include: {
        dashboard: {
          include: {
            monthlyBreakdown: {
              orderBy: [
                { year: 'desc' },
                { month: 'desc' }
              ],
              take: 12 // Last 12 months
            }
          }
        }
      }
    });

    console.log("Owner found:", owner ? "Yes" : "No");

    if (!owner) {
      console.log("Owner not found for userId:", userId);
      return res.status(404).json({ message: "Owner not found" });
    }

    // Get recent quotations with payment status
    const recentQuotations = await prisma.quotation.findMany({
      where: { ownerId: owner.id },
      include: {
        customer: true,
        payment: true,
        items: {
          include: {
            item: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get payment statistics
    const paymentStats = await prisma.payment.groupBy({
      by: ['status'],
      where: {
        quotation: {
          ownerId: owner.id
        }
      },
      _count: {
        status: true
      },
      _sum: {
        amount: true
      }
    });

    // Get overdue payments
    const overduePayments = await prisma.payment.findMany({
      where: {
        quotation: {
          ownerId: owner.id
        },
        status: 'OVERDUE',
        dueDate: {
          lt: new Date()
        }
      },
      include: {
        quotation: {
          include: {
            customer: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Calculate total revenue and collected amounts
    const totalRevenue = recentQuotations.reduce((sum, q) => {
      return sum + q.items.reduce((itemSum, qi) => {
        return itemSum + (qi.item.rate * qi.quantity * (1 + qi.item.tax / 100));
      }, 0);
    }, 0);

    const totalCollected = paymentStats
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + (p._sum.amount || 0), 0);

    const totalPending = paymentStats
      .filter(p => ['PENDING', 'OVERDUE'].includes(p.status))
      .reduce((sum, p) => sum + (p._sum.amount || 0), 0);

    const dashboardData = {
      owner: {
        id: owner.id,
        name: owner.name,
        companyName: owner.compneyname,
        email: owner.email
      },
      overview: {
        totalRevenue: totalRevenue,
        totalCollected: totalCollected,
        totalPending: totalPending,
        totalQuotations: recentQuotations.length,
        totalCustomers: await prisma.customer.count({ where: { ownerId: owner.id } }),
        totalItems: await prisma.item.count({ where: { ownerId: owner.id } })
      },
      paymentStatus: {
        paid: paymentStats.find(p => p.status === 'PAID')?._count.status || 0,
        pending: paymentStats.find(p => p.status === 'PENDING')?._count.status || 0,
        overdue: paymentStats.find(p => p.status === 'OVERDUE')?._count.status || 0,
        partial: paymentStats.find(p => p.status === 'PARTIAL')?._count.status || 0
      },
      recentActivity: {
        quotations: recentQuotations.slice(0, 5),
        overduePayments: overduePayments.slice(0, 5)
      },
      monthlyBreakdown: owner.dashboard?.monthlyBreakdown || []
    };

    console.log("Dashboard data prepared:", {
      ownerId: dashboardData.owner.id,
      totalQuotations: dashboardData.overview.totalQuotations,
      totalRevenue: dashboardData.overview.totalRevenue
    });
    
    return res.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    return res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
});

// Get user performance analytics
router.get("/user-performance", async (req, res) => {
  try {
    const userId = req.userId;
    
    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId },
      include: {
        monthlyStats: {
          orderBy: [
            { year: 'desc' },
            { month: 'desc' }
          ],
          take: 12
        }
      }
    });

    if (!analytics) {
      return res.json({
        totalQuotationsCreated: 0,
        totalRevenueGenerated: 0,
        totalAmountCollected: 0,
        totalAmountPending: 0,
        totalCustomersAdded: 0,
        totalItemsAdded: 0,
        monthlyStats: []
      });
    }

    return res.json(analytics);
  } catch (error) {
    console.error("Error fetching user performance:", error);
    return res.status(500).json({ message: "Error fetching user performance", error: error.message });
  }
});

// Get revenue tracking data
router.get("/revenue", async (req, res) => {
  try {
    const userId = req.userId;
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Get all quotations with payment data
    const quotations = await prisma.quotation.findMany({
      where: { ownerId: owner.id },
      include: {
        payment: true,
        items: {
          include: {
            item: true
          }
        }
      }
    });

    // Calculate revenue metrics
    const revenueData = quotations.map(q => {
      const totalAmount = q.items.reduce((sum, qi) => {
        return sum + (qi.item.rate * qi.quantity * (1 + qi.item.tax / 100));
      }, 0);

      return {
        quotationId: q.id,
        quotationNumber: q.number,
        customerName: q.customer.name,
        totalAmount,
        collectedAmount: q.payment?.amount || 0,
        pendingAmount: totalAmount - (q.payment?.amount || 0),
        status: q.payment?.status || 'PENDING',
        dueDate: q.payment?.dueDate,
        paidAt: q.payment?.paidAt,
        createdAt: q.createdAt
      };
    });

    const summary = {
      totalRevenue: revenueData.reduce((sum, r) => sum + r.totalAmount, 0),
      totalCollected: revenueData.reduce((sum, r) => sum + r.collectedAmount, 0),
      totalPending: revenueData.reduce((sum, r) => sum + r.pendingAmount, 0),
      totalQuotations: revenueData.length,
      paidQuotations: revenueData.filter(r => r.status === 'PAID').length,
      pendingQuotations: revenueData.filter(r => ['PENDING', 'OVERDUE'].includes(r.status)).length
    };

    return res.json({
      summary,
      details: revenueData
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return res.status(500).json({ message: "Error fetching revenue data", error: error.message });
  }
});

// Get payment status tracking
router.get("/payments", async (req, res) => {
  try {
    const userId = req.userId;
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const payments = await prisma.payment.findMany({
      where: {
        quotation: {
          ownerId: owner.id
        }
      },
      include: {
        quotation: {
          include: {
            customer: true
          }
        },
        reminders: {
          orderBy: { sentAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const paymentStatus = {
      pending: payments.filter(p => p.status === 'PENDING'),
      paid: payments.filter(p => p.status === 'PAID'),
      overdue: payments.filter(p => p.status === 'OVERDUE'),
      partial: payments.filter(p => p.status === 'PARTIAL'),
      cancelled: payments.filter(p => p.status === 'CANCELLED')
    };

    return res.json({
      payments,
      status: paymentStatus,
      summary: {
        total: payments.length,
        pending: paymentStatus.pending.length,
        paid: paymentStatus.paid.length,
        overdue: paymentStatus.overdue.length,
        partial: paymentStatus.partial.length,
        cancelled: paymentStatus.cancelled.length
      }
    });
  } catch (error) {
    console.error("Error fetching payment data:", error);
    return res.status(500).json({ message: "Error fetching payment data", error: error.message });
  }
});

// Get monthly analytics
router.get("/monthly/:year/:month", async (req, res) => {
  try {
    const userId = req.userId;
    const { year, month } = req.params;
    
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    // Get quotations for the month
    const quotations = await prisma.quotation.findMany({
      where: {
        ownerId: owner.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        customer: true,
        payment: true,
        items: {
          include: {
            item: true
          }
        }
      }
    });

    // Get payments for the month
    const payments = await prisma.payment.findMany({
      where: {
        quotation: {
          ownerId: owner.id
        },
        paidAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Get new customers added in the month
    const newCustomers = await prisma.customer.count({
      where: {
        ownerId: owner.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Get new items added in the month
    const newItems = await prisma.item.count({
      where: {
        ownerId: owner.id,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    const monthlyData = {
      year: parseInt(year),
      month: parseInt(month),
      quotations: {
        total: quotations.length,
        revenue: quotations.reduce((sum, q) => {
          return sum + q.items.reduce((itemSum, qi) => {
            return itemSum + (qi.item.rate * qi.quantity * (1 + qi.item.tax / 100));
          }, 0);
        }, 0),
        paid: quotations.filter(q => q.payment?.status === 'PAID').length,
        pending: quotations.filter(q => q.payment?.status === 'PENDING').length
      },
      payments: {
        total: payments.length,
        amount: payments.reduce((sum, p) => sum + p.amount, 0),
        byMethod: payments.reduce((acc, p) => {
          acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
          return acc;
        }, {})
      },
      growth: {
        newCustomers,
        newItems
      },
      details: {
        quotations,
        payments
      }
    };

    return res.json(monthlyData);
  } catch (error) {
    console.error("Error fetching monthly analytics:", error);
    return res.status(500).json({ message: "Error fetching monthly analytics", error: error.message });
  }
});

// Get business growth tracking
router.get("/growth", async (req, res) => {
  try {
    const userId = req.userId;
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    // Get customer growth over time
    const customerGrowth = await prisma.customer.findMany({
      where: { ownerId: owner.id },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Get item growth over time
    const itemGrowth = await prisma.item.findMany({
      where: { ownerId: owner.id },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Get quotation growth over time
    const quotationGrowth = await prisma.quotation.findMany({
      where: { ownerId: owner.id },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    // Group by month for the last 12 months
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        label: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
      });
    }

    const growthData = months.map(month => {
      const startDate = new Date(month.year, month.month - 1, 1);
      const endDate = new Date(month.year, month.month, 0);

      const customersInMonth = customerGrowth.filter(c => 
        c.createdAt >= startDate && c.createdAt <= endDate
      ).length;

      const itemsInMonth = itemGrowth.filter(i => 
        i.createdAt >= startDate && i.createdAt <= endDate
      ).length;

      const quotationsInMonth = quotationGrowth.filter(q => 
        q.createdAt >= startDate && q.createdAt <= endDate
      ).length;

      return {
        ...month,
        customers: customersInMonth,
        items: itemsInMonth,
        quotations: quotationsInMonth
      };
    });

    return res.json({
      summary: {
        totalCustomers: customerGrowth.length,
        totalItems: itemGrowth.length,
        totalQuotations: quotationGrowth.length
      },
      monthlyGrowth: growthData
    });
  } catch (error) {
    console.error("Error fetching growth data:", error);
    return res.status(500).json({ message: "Error fetching growth data", error: error.message });
  }
});

// Get payment reminders
router.get("/reminders", async (req, res) => {
  try {
    const userId = req.userId;
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const reminders = await prisma.paymentReminder.findMany({
      where: {
        payment: {
          quotation: {
            ownerId: owner.id
          }
        }
      },
      include: {
        payment: {
          include: {
            quotation: {
              include: {
                customer: true
              }
            }
          }
        }
      },
      orderBy: { sentAt: 'desc' },
      take: 50
    });

    const reminderStats = await prisma.paymentReminder.groupBy({
      by: ['type', 'status'],
      where: {
        payment: {
          quotation: {
            ownerId: owner.id
          }
        }
      },
      _count: {
        id: true
      }
    });

    return res.json({
      reminders,
      stats: reminderStats,
      summary: {
        total: reminders.length,
        sent: reminders.filter(r => r.status === 'SENT').length,
        delivered: reminders.filter(r => r.status === 'DELIVERED').length,
        failed: reminders.filter(r => r.status === 'FAILED').length
      }
    });
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return res.status(500).json({ message: "Error fetching reminders", error: error.message });
  }
});

// Update analytics when quotation is created
router.post("/update-quotation-created", async (req, res) => {
  try {
    const userId = req.userId;
    const { quotationId, totalAmount } = req.body;

    // Update user analytics
    await prisma.userAnalytics.upsert({
      where: { userId },
      update: {
        totalQuotationsCreated: {
          increment: 1
        },
        totalRevenueGenerated: {
          increment: totalAmount
        },
        lastQuotationCreated: new Date()
      },
      create: {
        userId,
        totalQuotationsCreated: 1,
        totalRevenueGenerated: totalAmount,
        lastQuotationCreated: new Date()
      }
    });

    // Update owner dashboard
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (owner) {
      await prisma.ownerDashboard.upsert({
        where: { ownerId: owner.id },
        update: {
          totalQuotations: {
            increment: 1
          },
          totalRevenue: {
            increment: totalAmount
          },
          lastQuotationDate: new Date()
        },
        create: {
          ownerId: owner.id,
          totalQuotations: 1,
          totalRevenue: totalAmount,
          lastQuotationDate: new Date()
        }
      });
    }

    return res.json({ message: "Analytics updated successfully" });
  } catch (error) {
    console.error("Error updating analytics:", error);
    return res.status(500).json({ message: "Error updating analytics", error: error.message });
  }
});

// Update analytics when payment is received
router.post("/update-payment-received", async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    // Update user analytics
    await prisma.userAnalytics.upsert({
      where: { userId },
      update: {
        totalAmountCollected: {
          increment: amount
        },
        totalAmountPending: {
          decrement: amount
        },
        lastPaymentReceived: new Date()
      },
      create: {
        userId,
        totalAmountCollected: amount,
        lastPaymentReceived: new Date()
      }
    });

    // Update owner dashboard
    const owner = await prisma.owner.findUnique({
      where: { userId }
    });

    if (owner) {
      await prisma.ownerDashboard.upsert({
        where: { ownerId: owner.id },
        update: {
          totalCollected: {
            increment: amount
          },
          totalPending: {
            decrement: amount
          },
          lastPaymentDate: new Date()
        },
        create: {
          ownerId: owner.id,
          totalCollected: amount,
          lastPaymentDate: new Date()
        }
      });
    }

    return res.json({ message: "Payment analytics updated successfully" });
  } catch (error) {
    console.error("Error updating payment analytics:", error);
    return res.status(500).json({ message: "Error updating payment analytics", error: error.message });
  }
});

// Send payment reminder
router.post("/send-reminder", async (req, res) => {
  try {
    const userId = req.userId;
    const { paymentId } = req.body;

    // Verify the payment belongs to the authenticated user
    const payment = await prisma.payment.findFirst({
      where: {
        id: paymentId,
        quotation: {
          owner: {
            userId: userId
          }
        }
      },
      include: {
        quotation: {
          include: {
            customer: true,
            owner: true
          }
        }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Create a reminder record
    const reminder = await prisma.paymentReminder.create({
      data: {
        paymentId: paymentId,
        type: 'DUE_DATE',
        status: 'SENT'
      }
    });

    // Here you would typically integrate with an email/SMS service
    // For now, we'll just log the reminder
    console.log(`Payment reminder sent for quotation #${payment.quotation.number} to ${payment.quotation.customer.name}`);

    return res.json({ 
      message: "Payment reminder sent successfully",
      reminder: reminder
    });
  } catch (error) {
    console.error("Error sending payment reminder:", error);
    return res.status(500).json({ message: "Error sending payment reminder", error: error.message });
  }
});

export default router; 