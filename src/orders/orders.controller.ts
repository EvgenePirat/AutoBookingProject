import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/request/create-order-dto';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { OrderDto } from './dto/response/OrderDto ';
import { UpdateOrderDto } from './dto/request/update-order.dto';
import { LogRequest } from 'src/common/decorators/log-request-response.decorator';

@ApiTags('Order')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("include/all")
  @ApiResponse({ status: 200, description: 'List of all orders', type: [OrderDto] })
  @LogRequest()
  async getAllOrdersWithAllInclude(): Promise<OrderDto[]> {
    return this.ordersService.getAllWithAllInclude();
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of all orders', type: [OrderDto] })
  @LogRequest()
  async getAllOrdersWithoutInclude(): Promise<OrderDto[]> {
    return this.ordersService.getAllWithoutInclude();
  }

  @Get('include/:id')
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @LogRequest()
  async getOrderByIdWithAllInclude(@Param('id') id: number): Promise<OrderDto> {
    return this.ordersService.getOrderByIdWithAllInclude(id);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Order details retrieved successfully', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @LogRequest()
  async getOrderByIdWithoutInclude(@Param('id') id: number): Promise<OrderDto> {
    return this.ordersService.getOrderByIdWithoutInclude(id);
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Order successfully created', type: OrderDto })
  @LogRequest()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
    return this.ordersService.create(createOrderDto);
  }

  @Post('bulk')
  @ApiResponse({ status: 201, description: 'Multiple orders successfully created', type: [OrderDto] })
  @ApiResponse({ status: 400, description: 'Invalid input data for creating orders' })
  @LogRequest()
  async createMultipleOrders(
    @Body() createOrdersDto: CreateOrderDto[]
  ): Promise<OrderDto[]> {
    return this.ordersService.createMultipleOrders(createOrdersDto);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Order successfully updated', type: OrderDto })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @LogRequest()
  async updateOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiResponse({ status: 204, description: 'Order successfully deleted' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @LogRequest()
  async deleteOrder(@Param('id') id: number): Promise<void> {
    return this.ordersService.delete(id);
  }
}