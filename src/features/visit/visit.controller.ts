import { Request, Response } from 'express';
import visitService from './visit.service';
import logger from '@utils/logger';

class VisitController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const visit = await visitService.createVisit(req.body);
      return res.status(201).json(visit);
    } catch (error) {
      logger.error('Error creating visit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const visits = await visitService.getAllVisits();
      return res.status(200).json(visits);
    } catch (error) {
      logger.error('Error fetching visits:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const visit = await visitService.getVisitById(id);

      if (!visit) {
        return res.status(404).json({ message: 'Visit not found' });
      }

      return res.status(200).json(visit);
    } catch (error) {
      logger.error('Error fetching visit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const visit = await visitService.updateVisit(id, req.body);
      return res.status(200).json(visit);
    } catch (error) {
      logger.error('Error updating visit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await visitService.deleteVisit(id);

      if (!deleted) {
        return res.status(404).json({ message: 'Visit not found' });
      }

      return res.status(200).json({ message: 'Visit deleted successfully' });
    } catch (error) {
      logger.error('Error deleting visit:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getByOrganization(req: Request, res: Response): Promise<Response> {
    try {
      const { orgId } = req.params;
      const visits = await visitService.getVisitsByOrganization(orgId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error('Error fetching visits by organization:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getByCaregiver(req: Request, res: Response): Promise<Response> {
    try {
      const { caregiverId } = req.params;
      const visits = await visitService.getVisitsByCaregiver(caregiverId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error('Error fetching visits by caregiver:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getByPatient(req: Request, res: Response): Promise<Response> {
    try {
      const { patientId } = req.params;
      const visits = await visitService.getVisitsByPatient(patientId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error('Error fetching visits by patient:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new VisitController();
