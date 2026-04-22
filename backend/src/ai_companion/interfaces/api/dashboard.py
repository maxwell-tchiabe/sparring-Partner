from fastapi import APIRouter, Request, HTTPException, Path
from typing import List, Dict
import logging

from ai_companion.modules.dashboard.service import DashboardService
from ai_companion.models.dashboard import DashboardStats, AIInsight, Badge, LearningError

logger = logging.getLogger(__name__)

dashboard_router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@dashboard_router.get("/stats/{user_id}", response_model=DashboardStats)
async def get_dashboard_stats(
    request: Request,
    user_id: str = Path(..., description="The ID of the user")
):
    """Retrieve dashboard statistics for a specific user"""
    # In a production app, we would verify that the authenticated user
    # matches the user_id or has admin permissions.
    try:
        return await DashboardService.get_stats(user_id)
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@dashboard_router.get("/insights/{user_id}", response_model=List[AIInsight])
async def get_dashboard_insights(
    request: Request,
    user_id: str = Path(..., description="The ID of the user")
):
    """Retrieve AI-driven learning insights for the user"""
    try:
        return await DashboardService.get_insights(user_id)
    except Exception as e:
        logger.error(f"Error fetching dashboard insights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@dashboard_router.get("/badges/{user_id}", response_model=List[Badge])
async def get_dashboard_badges(
    request: Request,
    user_id: str = Path(..., description="The ID of the user")
):
    """Retrieve badges earned by the user"""
    try:
        return await DashboardService.get_badges(user_id)
    except Exception as e:
        logger.error(f"Error fetching dashboard badges: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@dashboard_router.get("/errors/{user_id}", response_model=List[LearningError])
async def get_dashboard_errors(
    request: Request,
    user_id: str = Path(..., description="The ID of the user")
):
    """Retrieve a history of learning errors/corrections for the user"""
    try:
        return await DashboardService.get_learning_errors(user_id)
    except Exception as e:
        logger.error(f"Error fetching dashboard errors: {e}")
        raise HTTPException(status_code=500, detail=str(e))
