import { Controller, Get, Post, Body, Patch, Param, Delete , ParseIntPipe, NotFoundException,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ArticleEntity } from './entities/article.entity';


@Controller('articles')
@ApiTags('articles')

export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

// src/articles/articles.controller.ts

@Post()
async create(@Body() createArticleDto: CreateArticleDto) {
  return new ArticleEntity(
    await this.articlesService.create(createArticleDto),
  );
}

@Get()
@ApiOkResponse({ type: ArticleEntity, isArray: true })
async findAll() {
  const articles = await this.articlesService.findAll();
  return articles.map((article) => new ArticleEntity(article));
}


@Get('drafts')
@ApiOkResponse({ type: ArticleEntity, isArray: true })
async findDrafts() {
  const drafts = await this.articlesService.findDrafts();
  return drafts.map((draft) => new ArticleEntity(draft));
}

@Get(':id')
@ApiOkResponse({ type: ArticleEntity })
async findOne(@Param('id', ParseIntPipe) id: number) {
  const article = await this.articlesService.findOne(id);
  if (!article) {
    throw new NotFoundException(`Article with ID ${id} not found`);
  }
  return new ArticleEntity(article);
}

  @Patch(':id')
  @ApiCreatedResponse({ type: ArticleEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    return new ArticleEntity(
      await this.articlesService.update(id, updateArticleDto),
    );  }

  @Delete(':id')
  @ApiOkResponse({ type: ArticleEntity })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
